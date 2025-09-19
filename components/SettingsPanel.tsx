
import React, { useMemo } from 'react';
import type { Theme, Settings, Timeframe } from '../types';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenAssetModal: () => void;
    onOpenAlertsModal: () => void;
    onReset: () => void;
    theme: Theme;
    onThemeToggle: () => void;
    settings: Settings;
    onSettingChange: (key: keyof Settings, value: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    onClose,
    onOpenAssetModal,
    onOpenAlertsModal,
    onReset,
    theme,
    onThemeToggle,
    settings,
    onSettingChange,
}) => {
    
    if (!isOpen) {
        return null;
    }

    const handleResetClick = () => {
        if (window.confirm("Are you sure you want to clear all data? This will reset all favorites, custom assets, and settings to their defaults. The application will then refresh.")) {
            onReset();
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300" onClick={onClose}></div>
            <div
                className={`fixed top-0 right-0 h-full bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-lg border-l border-light-border/50 dark:border-dark-border/50 text-dark-text dark:text-light-text shadow-2xl z-50 w-80 max-w-[90vw] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-2xl font-bold">Settings</h3>
                    <button onClick={onClose} className="text-2xl text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text transition-colors" aria-label="Close settings">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                {/* Main Content (menu) */}
                <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                    {/* Customization Section */}
                    <div>
                        <h4 className="px-3 pb-2 font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider text-sm">Customization</h4>
                        <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => { onOpenAssetModal(); onClose(); }}
                                    className="w-full text-left p-3 rounded-lg bg-light-card/80 dark:bg-dark-card/80 hover:bg-light-border dark:hover:bg-dark-border transition-colors flex items-center gap-4"
                                >
                                    <i className="fa-solid fa-list-check w-5 text-center text-lg text-primary-light dark:text-primary"></i>
                                    <span className="font-semibold">Asset List</span>
                                </button>
                            </li>
                             <li>
                                <div className="p-3 rounded-lg bg-light-card/80 dark:bg-dark-card/80 flex items-center justify-between">
                                    <label htmlFor="theme-toggle" className="font-semibold cursor-pointer pr-4 text-dark-text dark:text-light-text flex-grow flex items-center gap-4">
                                         <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'} w-5 text-center text-lg text-primary-light dark:text-primary`}></i>
                                        <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            id="theme-toggle"
                                            className="sr-only peer"
                                            checked={theme === 'dark'}
                                            onChange={onThemeToggle}
                                        />
                                        <div className="w-11 h-6 bg-light-border peer-focus:outline-none rounded-full peer dark:bg-dark-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-dark-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light dark:peer-checked:bg-primary"></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Notifications Section */}
                    <div>
                        <h4 className="px-3 pb-2 font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider text-sm">Notifications</h4>
                         <ul className="space-y-2">
                            <li>
                                <button
                                    onClick={() => { onOpenAlertsModal(); onClose(); }}
                                    className="w-full text-left p-3 rounded-lg bg-light-card/80 dark:bg-dark-card/80 hover:bg-light-border dark:hover:bg-dark-border transition-colors flex items-center gap-4"
                                >
                                    <i className="fa-solid fa-bell w-5 text-center text-lg text-primary-light dark:text-primary"></i>
                                    <span className="font-semibold">Configure Alerts</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    
                    {/* View Options Section */}
                    <div>
                        <h4 className="px-3 pb-2 font-semibold text-medium-text-light dark:text-medium-text uppercase tracking-wider text-sm">View Options</h4>
                        <ul className="space-y-2">
                            <li>
                                <div className="p-3 rounded-lg bg-light-card/80 dark:bg-dark-card/80 flex items-center justify-between">
                                    <label htmlFor="stoch-view-toggle" className="font-semibold cursor-pointer pr-4 text-dark-text dark:text-light-text flex-grow">Stochastic View</label>
                                    <div className="relative">
                                        <input type="checkbox" id="stoch-view-toggle" className="sr-only peer" checked={settings.showStochView} onChange={(e) => onSettingChange('showStochView', e.target.checked)} />
                                        <div className="w-11 h-6 bg-light-border peer-focus:outline-none rounded-full peer dark:bg-dark-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-dark-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light dark:peer-checked:bg-primary"></div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="p-3 rounded-lg bg-light-card/80 dark:bg-dark-card/80 flex items-center justify-between">
                                    <label htmlFor="heatmap-view-toggle" className="font-semibold cursor-pointer pr-4 text-dark-text dark:text-light-text flex-grow">Heatmap View</label>
                                    <div className="relative">
                                        <input type="checkbox" id="heatmap-view-toggle" className="sr-only peer" checked={settings.showHeatmapView} onChange={(e) => onSettingChange('showHeatmapView', e.target.checked)} />
                                        <div className="w-11 h-6 bg-light-border peer-focus:outline-none rounded-full peer dark:bg-dark-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-dark-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light dark:peer-checked:bg-primary"></div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="p-3 rounded-lg bg-light-card/80 dark:bg-dark-card/80 flex items-center justify-between">
                                    <label htmlFor="price-view-toggle" className="font-semibold cursor-pointer pr-4 text-dark-text dark:text-light-text flex-grow">Price View</label>
                                    <div className="relative">
                                        <input type="checkbox" id="price-view-toggle" className="sr-only peer" checked={settings.showPriceView} onChange={(e) => onSettingChange('showPriceView', e.target.checked)} />
                                        <div className="w-11 h-6 bg-light-border peer-focus:outline-none rounded-full peer dark:bg-dark-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-dark-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light dark:peer-checked:bg-primary"></div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>


                {/* Footer (Reset button) */}
                <div className="p-4 mt-auto border-t border-light-border dark:border-dark-border">
                    <button
                        onClick={handleResetClick}
                        className="w-full p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors flex items-center justify-center gap-3"
                    >
                         <i className="fa-solid fa-broom w-5 text-center text-lg"></i>
                         <span className="font-semibold">Reset App</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;