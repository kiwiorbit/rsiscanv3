import React from 'react';
import type { Settings, AlertConditions } from '../types';

interface AlertsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onAlertConditionChange: (key: keyof AlertConditions, value: boolean) => void;
}

const AlertToggle: React.FC<{
    condition: keyof AlertConditions;
    label: string;
    description: string;
    settings: Settings;
    onChange: AlertsModalProps['onAlertConditionChange'];
}> = ({ condition, label, description, settings, onChange }) => {
    const isEnabled = settings.alertConditions[condition];
    const id = `modal-alert-toggle-${condition}`;
    return (
        <li>
            <div className="p-3 rounded-lg bg-light-bg/80 dark:bg-dark-bg/80 flex items-center justify-between">
                <label htmlFor={id} className="cursor-pointer pr-4 text-dark-text dark:text-light-text flex-grow">
                    <span className="font-semibold">{label}</span>
                    <p className="text-xs text-medium-text-light dark:text-medium-text">{description}</p>
                </label>
                <div className="relative">
                    <input
                        type="checkbox"
                        id={id}
                        className="sr-only peer"
                        checked={isEnabled}
                        onChange={(e) => onChange(condition, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-light-border peer-focus:outline-none rounded-full peer dark:bg-dark-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-dark-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light dark:peer-checked:bg-primary"></div>
                </div>
            </div>
        </li>
    );
};

const AlertsModal: React.FC<AlertsModalProps> = ({ isOpen, onClose, settings, onAlertConditionChange }) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-dark-bg/80 dark:bg-dark-bg/90 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md h-auto max-h-[90vh] flex flex-col border border-light-border/50 dark:border-dark-border/50">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-light-border dark:border-dark-border">
                    <h2 className="text-xl font-bold text-dark-text dark:text-light-text">Configure Alerts</h2>
                    <button onClick={onClose} className="text-2xl text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text transition-colors" aria-label="Close alert settings">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow p-4 overflow-y-auto space-y-6">
                    <div>
                        <h5 className="px-3 pb-2 font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider text-sm">Indicator Alerts</h5>
                        <ul className="space-y-2">
                            <AlertToggle condition="extreme" label="Extreme Alerts" description="RSI > 70 or < 30. (15m, 1h, 2h, 4h, 8h, 1d, 1w)" settings={settings} onChange={onAlertConditionChange} />
                            <AlertToggle condition="rsiSmaCross" label="RSI/SMA Cross Alerts" description="RSI crosses its SMA. (15m, 1h, 2h, 4h, 8h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                            <AlertToggle condition="divergence" label="Divergence Alerts" description="Bullish/Bearish divergences. (1h, 4h, 8h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                            <AlertToggle condition="stochRecovery" label="Stoch Recovery from Zero" description="Stoch hits 0, then recovers. (1h, 2h, 4h, 8h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                            <AlertToggle condition="stochCross" label="Stoch Cross after Recovery" description="Stoch crosses after recovery. (1h, 2h, 4h, 8h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                        </ul>
                    </div>
                     <div>
                        <h5 className="px-3 pb-2 font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider text-sm">Price-Based Alerts</h5>
                        <ul className="space-y-2">
                             <AlertToggle condition="priceGoldenPocket" label="Price in Golden Pocket" description="Price enters the 0.618 Fib zone. (1h, 4h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                             <AlertToggle condition="gpReversalVolume" label="GP Reversal w/ Volume" description="Price reverses from GP w/ volume. (1h, 4h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                             <AlertToggle condition="fib786Reversal" label="0.786 Fib Reversal" description="Price reverses from the 0.786 Fib zone. (1h, 4h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                        </ul>
                    </div>
                     <div>
                        <h5 className="px-3 pb-2 font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider text-sm">Volume-Based Alerts</h5>
                        <ul className="space-y-2">
                             <AlertToggle condition="breakoutVolume" label="Breakout Volume Surge" description="Breaks swing high w/ >200% avg vol. (1h, 4h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                             <AlertToggle condition="capitulationVolume" label="Capitulation Volume Reversal" description="Exhaustion candle w/ >300% avg vol. (1h, 4h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                             <AlertToggle condition="accumulationVolume" label="Accumulation Volume" description="Sideways price w/ high buy vol. (1h, 4h, 1d, 3d)" settings={settings} onChange={onAlertConditionChange} />
                        </ul>
                    </div>
                </div>
                
                 {/* Footer */}
                <div className="flex justify-end p-4 border-t border-light-border dark:border-dark-border">
                    <button onClick={onClose} className="px-6 py-2 font-bold text-white dark:text-dark-bg bg-primary-light dark:bg-primary rounded-lg hover:opacity-90 transition-opacity">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertsModal;