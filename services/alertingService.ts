import type { SymbolData, Settings, Timeframe, Notification, HTFLevels, PriceDataPoint } from '../types';
import { detectBullishDivergence, detectBearishDivergence } from './divergenceService';

const ALERT_COOLDOWN = 180000; // 3 minutes to prevent spam

const calculateFibLevels = (chartData: PriceDataPoint[]) => {
    if (!chartData || chartData.length < 2) return { gp: null, fib786: null };

    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    let highestHighIndex = -1;
    let lowestLowIndex = -1;

    chartData.forEach((k, index) => {
        if (k.high > highestHigh) {
            highestHigh = k.high;
            highestHighIndex = index;
        }
        if (k.low < lowestLow) {
            lowestLow = k.low;
            lowestLowIndex = index;
        }
    });
    
    const range = highestHigh - lowestLow;
    if (range === 0) return { gp: null, fib786: null };

    let gpTop, gpBottom, fib786;
    
    // An uptrend is when the low happens before the high
    if (lowestLowIndex < highestHighIndex) {
        // Retracement down from high
        gpTop = highestHigh - (range * 0.618);
        gpBottom = highestHigh - (range * 0.65);
        fib786 = highestHigh - (range * 0.786);
    } else { // A downtrend is when the high happens before the low
        // Retracement up from low
        gpTop = lowestLow + (range * 0.65);
        gpBottom = lowestLow + (range * 0.618);
        fib786 = lowestLow + (range * 0.786);
    }

    return { gp: { top: Math.max(gpTop, gpBottom), bottom: Math.min(gpTop, gpBottom) }, fib786 };
};

const getAverageVolume = (klines: PriceDataPoint[], period: number): number => {
    if (klines.length < period) return 0;
    const window = klines.slice(-period);
    return window.reduce((sum, k) => sum + k.volume, 0) / window.length;
};

export const checkAllAlerts = (
    symbol: string,
    timeframe: Timeframe,
    data: SymbolData,
    settings: Settings,
    alertStates: Record<string, any>,
    setAlertStates: React.Dispatch<React.SetStateAction<Record<string, any>>>,
    htfLevels: HTFLevels | null
): Omit<Notification, 'id' | 'read'>[] => {
    const alertsToFire: Omit<Notification, 'id' | 'read'>[] = [];
    
    // Robustness check: Ensure all necessary data arrays have at least 2 points for comparison.
    if (
        !data.rsi || data.rsi.length < 2 ||
        !data.sma || data.sma.length < 2 ||
        !data.stochK || data.stochK.length < 2 ||
        !data.stochD || data.stochD.length < 2 ||
        !data.klines || data.klines.length < 2
    ) {
        return alertsToFire;
    }


    const { alertConditions } = settings;
    const now = Date.now();
    
    const lastRsi = data.rsi[data.rsi.length - 1];
    const prevRsi = data.rsi[data.rsi.length - 2];
    const lastSma = data.sma[data.sma.length - 1];
    const prevSma = data.sma[data.sma.length - 2];
    const lastStochK = data.stochK[data.stochK.length - 1];
    const prevStochK = data.stochK[data.stochK.length - 2];
    const lastStochD = data.stochD[data.stochD.length - 1];
    const prevStochD = data.stochD[data.stochD.length - 2];
    const lastKline = data.klines[data.klines.length - 1];

    const canFire = (type: string) => {
        const key = `${symbol}-${timeframe}-${type}`;
        const lastFired = alertStates[key];
        return !lastFired || now - lastFired > ALERT_COOLDOWN;
    };

    const setFired = (type: string) => {
        setAlertStates(prev => ({ ...prev, [`${symbol}-${timeframe}-${type}`]: now }));
    };

    // 1. Extreme Alerts
    if (alertConditions.extreme && ['15m', '1h', '2h', '4h', '8h', '1d', '1w'].includes(timeframe)) {
        if (lastRsi.value > 70 && prevRsi.value <= 70 && canFire('overbought')) {
            alertsToFire.push({ symbol, timeframe, rsi: lastRsi.value, type: 'overbought' });
            setFired('overbought');
        }
        if (lastRsi.value < 30 && prevRsi.value >= 30 && canFire('oversold')) {
            alertsToFire.push({ symbol, timeframe, rsi: lastRsi.value, type: 'oversold' });
            setFired('oversold');
        }
    }

    // 2. RSI/SMA Cross Alerts
    if (alertConditions.rsiSmaCross && ['15m', '1h', '2h', '4h', '8h', '1d', '3d'].includes(timeframe)) {
        if (lastRsi.value > lastSma.value && prevRsi.value <= prevSma.value && canFire('bullish-cross')) {
            alertsToFire.push({ symbol, timeframe, rsi: lastRsi.value, type: 'bullish-cross' });
            setFired('bullish-cross');
        }
        if (lastRsi.value < lastSma.value && prevRsi.value >= prevSma.value && canFire('death-cross')) {
            alertsToFire.push({ symbol, timeframe, rsi: lastRsi.value, type: 'death-cross' });
            setFired('death-cross');
        }
    }
    
    // 3. Divergence Alerts
    if (alertConditions.divergence && ['1h', '4h', '8h', '1d', '3d'].includes(timeframe)) {
        const bullishDivergence = detectBullishDivergence(data.klines, data.rsi);
        if (bullishDivergence && bullishDivergence.pivotTime === lastRsi.time && canFire('bullish-divergence')) {
            alertsToFire.push({ symbol, timeframe, rsi: lastRsi.value, type: 'bullish-divergence' });
            setFired('bullish-divergence');
        }
        const bearishDivergence = detectBearishDivergence(data.klines, data.rsi);
        if (bearishDivergence && bearishDivergence.pivotTime === lastRsi.time && canFire('bearish-divergence')) {
            alertsToFire.push({ symbol, timeframe, rsi: lastRsi.value, type: 'bearish-divergence' });
            setFired('bearish-divergence');
        }
    }
    
    // 4. Stoch Recovery
    if (alertConditions.stochRecovery && ['1h', '2h', '4h', '8h', '1d', '3d'].includes(timeframe)) {
        const key = `${symbol}-${timeframe}-stoch-recovery-armed`;
        if (lastStochK.value > 0 && lastStochK.value < 5 && prevStochK.value === 0) {
            if (canFire('stoch-recovery')) {
                alertsToFire.push({ symbol, timeframe, type: 'stoch-recovery' });
                setFired('stoch-recovery');
                setAlertStates(prev => ({ ...prev, [key]: true }));
            }
        }
    }

    // 5. Stoch Cross after Recovery
    if (alertConditions.stochCross && ['1h', '2h', '4h', '8h', '1d', '3d'].includes(timeframe)) {
        const isArmedKey = `${symbol}-${timeframe}-stoch-recovery-armed`;
        if (alertStates[isArmedKey] && lastStochK.value > lastStochD.value && prevStochK.value <= prevStochD.value) {
            if (canFire('stoch-bullish-cross')) {
                alertsToFire.push({ symbol, timeframe, type: 'stoch-bullish-cross' });
                setFired('stoch-bullish-cross');
                setAlertStates(prev => ({ ...prev, [isArmedKey]: false }));
            }
        }
    }
    
    // Price-Based & Volume-Based Alerts
    const advancedTimeframes = ['1h', '4h', '1d', '3d'];
    if (advancedTimeframes.includes(timeframe)) {
        const fibs = calculateFibLevels(data.klines);
        // 6. Price in GP
        if (alertConditions.priceGoldenPocket && fibs.gp) {
            const isInGP = lastKline.close >= Math.min(fibs.gp.top, fibs.gp.bottom) && lastKline.close <= Math.max(fibs.gp.top, fibs.gp.bottom);
            const wasInGP = data.klines.length > 1 && (data.klines[data.klines.length - 2].close >= Math.min(fibs.gp.top, fibs.gp.bottom) && data.klines[data.klines.length - 2].close <= Math.max(fibs.gp.top, fibs.gp.bottom));
            if(isInGP && !wasInGP && canFire('price-golden-pocket')) {
                 alertsToFire.push({ symbol, timeframe, type: 'price-golden-pocket' });
                 setFired('price-golden-pocket');
                 setAlertStates(prev => ({ ...prev, [`${symbol}-${timeframe}-in-gp`]: true }));
            }
        }
        // 7. GP Reversal with Volume
        if (alertConditions.gpReversalVolume && alertStates[`${symbol}-${timeframe}-in-gp`]) {
            const pastFibs = calculateFibLevels(data.klines.slice(0, -1));
            if (pastFibs.gp) {
                const wasInGP = data.klines.length > 1 && (data.klines[data.klines.length - 2].close >= Math.min(pastFibs.gp.top, pastFibs.gp.bottom) && data.klines[data.klines.length - 2].close <= Math.max(pastFibs.gp.top, pastFibs.gp.bottom));
                const isOutOfGP = lastKline.close < Math.min(pastFibs.gp.top, pastFibs.gp.bottom) || lastKline.close > Math.max(pastFibs.gp.top, pastFibs.gp.bottom);
                
                if (wasInGP && isOutOfGP && data.klines.length > 4) {
                    const vol1 = data.klines[data.klines.length - 2].volume;
                    const vol2 = data.klines[data.klines.length - 3].volume;
                    const vol3 = data.klines[data.klines.length - 4].volume;
                    if (lastKline.volume > vol1 && vol1 > vol2 && vol2 > vol3 && canFire('gp-reversal-volume')) {
                        alertsToFire.push({ symbol, timeframe, type: 'gp-reversal-volume' });
                        setFired('gp-reversal-volume');
                        setAlertStates(prev => ({ ...prev, [`${symbol}-${timeframe}-in-gp`]: false }));
                    }
                }
            }
        }
        // 8. 0.786 Fib Reversal
        if (alertConditions.fib786Reversal && fibs.fib786) {
            const fibZoneTop = fibs.fib786 * 1.005;
            const fibZoneBottom = fibs.fib786 * 0.995;
            const wasInZone = data.klines.length > 1 && (data.klines[data.klines.length - 2].low <= fibZoneTop && data.klines[data.klines.length - 2].high >= fibZoneBottom);
            const isNowOutOfZone = lastKline.low > fibZoneTop || lastKline.high < fibZoneBottom;

            if(wasInZone && isNowOutOfZone && canFire('fib-786-reversal')) {
                alertsToFire.push({ symbol, timeframe, type: 'fib-786-reversal' });
                setFired('fib-786-reversal');
            }
        }
        // 9. Breakout Volume Surge
        if (alertConditions.breakoutVolume) {
            if (data.klines.length > 20) {
                const lookbackKlines = data.klines.slice(-21, -1);
                const swingHigh = Math.max(...lookbackKlines.map(k => k.high));
                const avgVolume = getAverageVolume(lookbackKlines, 20);

                if (lastKline.close > swingHigh && lastKline.volume > (avgVolume * 2) && canFire('breakout-volume')) {
                    alertsToFire.push({ symbol, timeframe, type: 'breakout-volume' });
                    setFired('breakout-volume');
                }
            }
        }
        // 10. Capitulation Volume
        if (alertConditions.capitulationVolume) {
             if (data.klines.length > 20 && data.priceSma.length > 0) {
                const lookbackKlines = data.klines.slice(-21, -1);
                const avgVolume = getAverageVolume(lookbackKlines, 20);
                const avgBodySize = lookbackKlines.reduce((sum, k) => sum + Math.abs(k.close - k.open), 0) / lookbackKlines.length;
                const lastPriceSma = data.priceSma[data.priceSma.length - 1].value;

                const isRedCandle = lastKline.close < lastKline.open;
                const isLargeBody = Math.abs(lastKline.close - lastKline.open) > (avgBodySize * 1.5);
                const isHighVolume = lastKline.volume > (avgVolume * 3);
                const isDowntrend = lastKline.close < lastPriceSma;

                if (isRedCandle && isLargeBody && isHighVolume && isDowntrend && canFire('capitulation-volume')) {
                     alertsToFire.push({ symbol, timeframe, type: 'capitulation-volume' });
                     setFired('capitulation-volume');
                }
            }
        }
        // 11. Accumulation Volume
        if (alertConditions.accumulationVolume) {
             if (data.klines.length >= 20) {
                const lookbackKlines = data.klines.slice(-20);
                const highestHigh = Math.max(...lookbackKlines.map(k => k.high));
                const lowestLow = Math.min(...lookbackKlines.map(k => k.low));
                const avgPrice = lookbackKlines.reduce((sum, k) => sum + k.close, 0) / lookbackKlines.length;
                const priceRange = highestHigh - lowestLow;
                
                if (avgPrice > 0 && (priceRange / avgPrice) < 0.10) { // isSideways and avoid div by zero
                    let upVolume = 0, upCount = 0, downVolume = 0, downCount = 0;
                    lookbackKlines.forEach(k => {
                        if (k.close > k.open) { upVolume += k.volume; upCount++; } 
                        else if (k.close < k.open) { downVolume += k.volume; downCount++; }
                    });
                    const avgUpVolume = upCount > 0 ? upVolume / upCount : 0;
                    const avgDownVolume = downCount > 0 ? downVolume / downCount : 0;
                    
                    if (avgDownVolume > 0 && avgUpVolume > (avgDownVolume * 1.75) && canFire('accumulation-volume')) {
                        alertsToFire.push({ symbol, timeframe, type: 'accumulation-volume' });
                        setFired('accumulation-volume');
                    }
                }
            }
        }
    }

    return alertsToFire;
};