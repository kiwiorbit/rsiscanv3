

import type { Notification } from '../types';

interface NotificationDetails {
    icon: string;
    title: string;
    body: string;
    accentColor: string;
    iconColor: string;
}

export const getNotificationDetails = (notification: Notification): NotificationDetails => {
    let icon = 'fa-bell', title = 'Notification', body = '...', accentColor = 'bg-gray-500', iconColor = 'text-gray-500';

    switch (notification.type) {
        case 'overbought':
            icon = 'fa-arrow-trend-up';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Overbought at ${notification.rsi?.toFixed(2)}`;
            accentColor = 'bg-red-500';
            iconColor = 'text-red-500';
            break;
        case 'oversold':
            icon = 'fa-arrow-trend-down';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Oversold at ${notification.rsi?.toFixed(2)}`;
            accentColor = 'bg-green-500';
            iconColor = 'text-green-500';
            break;
        case 'bullish-cross':
            icon = 'fa-angles-up';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Bullish Cross: RSI over SMA.`;
            accentColor = 'bg-sky-500';
            iconColor = 'text-sky-500';
            break;
        case 'death-cross':
            icon = 'fa-angles-down';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Death Cross: RSI under SMA.`;
            accentColor = 'bg-purple-500';
            iconColor = 'text-purple-500';
            break;
        case 'bullish-divergence':
            icon = 'fa-chart-line';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Bullish Divergence detected.`;
            accentColor = 'bg-green-600';
            iconColor = 'text-green-500';
            break;
        case 'bearish-divergence':
            icon = 'fa-chart-line';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Bearish Divergence detected.`;
            accentColor = 'bg-red-600';
            iconColor = 'text-red-500';
            break;
        case 'stoch-recovery':
            icon = 'fa-level-up-alt';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Stoch Recovery from Zero`;
            accentColor = 'bg-cyan-500';
            iconColor = 'text-cyan-500';
            break;
        case 'stoch-bullish-cross':
            icon = 'fa-signal';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Stoch Bullish Cross after Recovery`;
            accentColor = 'bg-blue-500';
            iconColor = 'text-blue-500';
            break;
        case 'price-golden-pocket':
            icon = 'fa-magnet';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Price in Golden Pocket`;
            accentColor = 'bg-amber-500';
            iconColor = 'text-amber-500';
            break;
        case 'gp-reversal-volume':
            icon = 'fa-chart-line';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `GP Reversal with rising volume`;
            accentColor = 'bg-amber-600';
            iconColor = 'text-amber-600';
            break;
        case 'fib-786-reversal':
            icon = 'fa-wave-square';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Reversal from 0.786 Fib Zone`;
            accentColor = 'bg-fuchsia-500';
            iconColor = 'text-fuchsia-500';
            break;
        case 'breakout-volume':
            icon = 'fa-bolt';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Breakout with Volume Surge`;
            accentColor = 'bg-yellow-500';
            iconColor = 'text-yellow-500';
            break;
        case 'capitulation-volume':
            icon = 'fa-skull-crossbones';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = `Capitulation Volume Detected`;
            accentColor = 'bg-slate-500';
            iconColor = 'text-slate-500';
            break;
        case 'accumulation-volume':
            icon = 'fa-box-archive';
            title = `${notification.symbol} (${notification.timeframe})`;
            body = notification.body || 'Accumulation Volume Detected';
            accentColor = 'bg-indigo-500';
            iconColor = 'text-indigo-500';
            break;
    }

    return { icon, title, body, accentColor, iconColor };
};