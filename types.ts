


export interface Kline {
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime: number;
    quoteAssetVolume: string;
    numberOfTrades: number;
    takerBuyBaseAssetVolume: string;
    takerBuyQuoteAssetVolume:string;
    ignore: string;
}

export interface RsiDataPoint {
    time: number;
    value: number;
}

export interface PriceDataPoint {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    takerBuyVolume: number;
}

export interface SymbolData {
    rsi: RsiDataPoint[];
    sma: RsiDataPoint[];
    priceSma: RsiDataPoint[];
    stochK: RsiDataPoint[];
    stochD: RsiDataPoint[];
    price: number;
    volume: number;
    klines: PriceDataPoint[];
}

export type Timeframe = '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '8h' | '1d' | '3d' | '1w';

export interface AlertConditions {
    extreme: boolean;
    rsiSmaCross: boolean;
    divergence: boolean;
    stochRecovery: boolean;
    stochCross: boolean;
    priceGoldenPocket: boolean;
    gpReversalVolume: boolean;
    fib786Reversal: boolean;
    breakoutVolume: boolean;
    capitulationVolume: boolean;
    accumulationVolume: boolean;
}

export interface Settings {
    bgColor: string;
    textColor: string;
    cellBgColor: string;
    rsiColor: string;
    smaColor: string;
    rsi50Color: string;
    lineWidth: number;
    stochKColor: string;
    stochDColor: string;
    showHeatmapView: boolean;
    showPriceView: boolean;
    showStochView: boolean;
    alertConditions: AlertConditions;
}

export type SortOrder = 'default' | 'rsi-asc' | 'rsi-desc' | 'chg-asc' | 'chg-desc' | 'stoch-asc' | 'stoch-desc';

export type DrawingTool = 'brush' | 'trendline';

export interface Drawing {
    tool: DrawingTool;
    points: { x: number; y: number }[];
    color: string;
    size: number;
}

export type Theme = 'light' | 'dark';
export type ViewMode = 'chart' | 'heatmap' | 'price' | 'stoch';
export type ActiveModal = 'rsi' | 'price' | 'stoch' | null;


export interface Notification {
  id: number;
  symbol: string;
  timeframe: Timeframe;
  rsi?: number;
  price?: number;
  type: 'overbought' | 'oversold' | 'bullish-cross' | 'death-cross' | 'bullish-divergence' | 'bearish-divergence' | 'stoch-recovery' | 'stoch-bullish-cross' | 'price-golden-pocket' | 'gp-reversal-volume' | 'fib-786-reversal' | 'breakout-volume' | 'capitulation-volume' | 'accumulation-volume';
  read: boolean;
  body?: string;
}

export interface VolumeProfileData {
    profile: { price: number; volume: number; buyVolume: number; sellVolume: number; }[];
    poc: number;
    vah: number;
    val: number;
    maxVolume: number;
    minPrice: number;
    maxPrice: number;
}

export interface VolumeProfileMetrics {
    poc: number | null;
    vah: number | null;
    val: number | null;
}

export interface HTFLevels {
    weekly: VolumeProfileMetrics;
    monthly: VolumeProfileMetrics;
}
