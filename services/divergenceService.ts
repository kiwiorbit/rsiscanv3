
import type { PriceDataPoint, RsiDataPoint } from '../types';

interface Pivot {
    index: number;
    value: number;
    time: number;
}

const findPivotLows = (data: (PriceDataPoint | RsiDataPoint)[], dataKey: 'low' | 'value', lookbackLeft: number, lookbackRight: number): Pivot[] => {
    const pivots: Pivot[] = [];
    if (data.length < lookbackLeft + lookbackRight + 1) {
        return [];
    }
    
    // We can't check pivots at the very start or end of the series
    for (let i = lookbackLeft; i < data.length - lookbackRight; i++) {
        const currentValue = data[i][dataKey as keyof typeof data[number]];
        
        let isPivot = true;
        // Check left
        for (let j = 1; j <= lookbackLeft; j++) {
            if (data[i - j][dataKey as keyof typeof data[number]] < currentValue) {
                isPivot = false;
                break;
            }
        }
        if (!isPivot) continue;

        // Check right
        for (let j = 1; j <= lookbackRight; j++) {
            if (data[i + j][dataKey as keyof typeof data[number]] <= currentValue) { // Note: using <= for the right to avoid multiple pivots for same low
                isPivot = false;
                break;
            }
        }

        if (isPivot) {
            pivots.push({ index: i, value: currentValue as number, time: data[i].time });
        }
    }
    return pivots;
};

const findPivotHighs = (data: (PriceDataPoint | RsiDataPoint)[], dataKey: 'high' | 'value', lookbackLeft: number, lookbackRight: number): Pivot[] => {
    const pivots: Pivot[] = [];
    if (data.length < lookbackLeft + lookbackRight + 1) {
        return [];
    }
    
    for (let i = lookbackLeft; i < data.length - lookbackRight; i++) {
        const currentValue = data[i][dataKey as keyof typeof data[number]];
        
        let isPivot = true;
        // Check left
        for (let j = 1; j <= lookbackLeft; j++) {
            if (data[i - j][dataKey as keyof typeof data[number]] > currentValue) {
                isPivot = false;
                break;
            }
        }
        if (!isPivot) continue;

        // Check right
        for (let j = 1; j <= lookbackRight; j++) {
            if (data[i + j][dataKey as keyof typeof data[number]] >= currentValue) {
                isPivot = false;
                break;
            }
        }

        if (isPivot) {
            pivots.push({ index: i, value: currentValue as number, time: data[i].time });
        }
    }
    return pivots;
};


export const detectBullishDivergence = (klines: PriceDataPoint[], rsiData: RsiDataPoint[]): { pivotTime: number, rsiValue: number } | null => {
    const lookback = 5;
    const rangeMin = 5;
    const rangeMax = 60;

    if (klines.length < rangeMax || rsiData.length < rangeMax) {
        return null;
    }

    const pricePivots = findPivotLows(klines, 'low', lookback, lookback);
    const rsiPivots = findPivotLows(rsiData, 'value', lookback, lookback);

    if (pricePivots.length < 2 || rsiPivots.length < 2) {
        return null;
    }

    // Get the two most recent pivots for each
    const lastPricePivot = pricePivots[pricePivots.length - 1];
    const prevPricePivot = pricePivots[pricePivots.length - 2];

    const lastRsiPivot = rsiPivots[rsiPivots.length - 1];
    const prevRsiPivot = rsiPivots[rsiPivots.length - 2];

    // For a classic divergence, the pivots should align in time.
    // A simple check is that the last price and RSI pivots are the same candle.
    if (lastPricePivot.time !== lastRsiPivot.time) {
        return null;
    }
    // And the previous price and RSI pivots are the same candle.
    if (prevPricePivot.time !== prevRsiPivot.time) {
        return null;
    }

    // Check the distance between the two pivot points
    const barDifference = lastPricePivot.index - prevPricePivot.index;
    if (barDifference < rangeMin || barDifference > rangeMax) {
        return null;
    }

    // Condition 1: Price makes a lower low
    const priceLowerLow = lastPricePivot.value < prevPricePivot.value;

    // Condition 2: RSI makes a higher high
    const rsiHigherLow = lastRsiPivot.value > prevRsiPivot.value;

    if (priceLowerLow && rsiHigherLow) {
        return {
            pivotTime: lastRsiPivot.time,
            rsiValue: lastRsiPivot.value
        };
    }
    
    return null;
};

export const detectBearishDivergence = (klines: PriceDataPoint[], rsiData: RsiDataPoint[]): { pivotTime: number, rsiValue: number } | null => {
    const lookback = 5;
    const rangeMin = 5;
    const rangeMax = 60;

    if (klines.length < rangeMax || rsiData.length < rangeMax) {
        return null;
    }

    const pricePivots = findPivotHighs(klines, 'high', lookback, lookback);
    const rsiPivots = findPivotHighs(rsiData, 'value', lookback, lookback);

    if (pricePivots.length < 2 || rsiPivots.length < 2) {
        return null;
    }

    const lastPricePivot = pricePivots[pricePivots.length - 1];
    const prevPricePivot = pricePivots[pricePivots.length - 2];

    const lastRsiPivot = rsiPivots[rsiPivots.length - 1];
    const prevRsiPivot = rsiPivots[rsiPivots.length - 2];

    if (lastPricePivot.time !== lastRsiPivot.time || prevPricePivot.time !== prevRsiPivot.time) {
        return null;
    }

    const barDifference = lastPricePivot.index - prevPricePivot.index;
    if (barDifference < rangeMin || barDifference > rangeMax) {
        return null;
    }

    // Condition 1: Price makes a higher high
    const priceHigherHigh = lastPricePivot.value > prevPricePivot.value;

    // Condition 2: RSI makes a lower high
    const rsiLowerHigh = lastRsiPivot.value < prevRsiPivot.value;

    if (priceHigherHigh && rsiLowerHigh) {
        return {
            pivotTime: lastRsiPivot.time,
            rsiValue: lastRsiPivot.value
        };
    }
    
    return null;
};
