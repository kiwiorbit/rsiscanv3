
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Settings, SymbolData, Timeframe, Theme, Notification, SortOrder, ViewMode, ActiveModal, AlertConditions } from '../types';
import useUserSettings from '../hooks/useUserSettings';
import useNotifications from '../hooks/useNotifications';
import useSymbolData from '../hooks/useSymbolData';
import { checkAllAlerts } from '../services/alertingService';

interface AppContextType {
    isInitializing: boolean;
    // User Settings
    settings: Settings;
    theme: Theme;
    favorites: string[];
    userSymbols: string[];
    allSymbols: string[];
    showFavoritesOnly: boolean;
    sortOrder: SortOrder;
    viewMode: ViewMode;
    page: string;
    handleThemeToggle: () => void;
    handleSettingChange: (key: keyof Settings, value: any) => void;
    handleAlertConditionChange: (key: keyof AlertConditions, value: boolean) => void;
    toggleFavorite: (symbol: string) => void;
    handleShowFavoritesOnlyToggle: () => void;
    handleSortChange: () => void;
    handleViewModeChange: (mode: ViewMode) => void;
    handleSaveAssetList: (data: { allSymbols: string[]; selectedSymbols: string[]; }) => void;
    handleNavigateToFullView: () => void;
    handleNavigateBack: () => void;
    handleResetSettings: () => void;
    // Symbol Data
    symbolsData: Record<string, SymbolData>;
    loading: boolean;
    timeframe: Timeframe;
    lastDataFetch: Date | null;
    handleTimeframeChange: (tf: Timeframe) => void;
    // Notifications
    activeToast: Notification | null;
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'read'>, showToast?: boolean) => void;
    handleToastFinished: () => void;
    markNotificationsAsRead: () => void;
    clearNotifications: () => void;
    ToastContainer: React.FC<{ toast: Notification | null; onFinish: () => void }>;
    // UI State
    activeSymbol: string | null;
    activeModal: ActiveModal;
    isSettingsOpen: boolean;
    isAssetModalOpen: boolean;
    isTradeSignalsModalOpen: boolean;
    isAlertsModalOpen: boolean;
    isPaperTradingOpen: boolean;
    handleSelectRsiSymbol: (symbol: string) => void;
    handleSelectStochSymbol: (symbol: string) => void;
    handleSelectPriceSymbol: (symbol: string) => void;
    handleCloseModal: () => void;
    handleSettingsToggle: () => void;
    setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAssetModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsTradeSignalsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAlertsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPaperTradingOpen: React.Dispatch<React.SetStateAction<boolean>>;
    searchTerm: string;
    handleSearchChange: (term: string) => void;
    handleSwitchToPriceChart: () => void;
    handleSwitchToRsiChart: () => void;
    handleSwitchToStochChart: () => void;
    displayedSymbols: string[];
    // Lock State
    isLocked: boolean;
    unlockApp: () => void;
}


const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- UI State ---
    const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [isTradeSignalsModalOpen, setIsTradeSignalsModalOpen] = useState(false);
    const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
    const [isPaperTradingOpen, setIsPaperTradingOpen] = useState(false); // This can be removed in a future step if the panel itself is removed
    const [searchTerm, setSearchTerm] = useState('');
    const [isInitializing, setIsInitializing] = useState(() => !sessionStorage.getItem('hasSeenSplash'));
    const [isLocked, setIsLocked] = useState(() => !sessionStorage.getItem('appIsUnlocked'));
    
    // --- Custom Hooks ---
    const { 
        settings, theme, favorites, userSymbols, allSymbols, showFavoritesOnly, 
        sortOrder, viewMode, page, timeframe, handleTimeframeChange, 
        ...userSettingsHandlers 
    } = useUserSettings();
    const { symbolsData, loading, lastDataFetch } = useSymbolData({ userSymbols, timeframe });
    const { notifications, activeToast, addNotification, handleToastFinished, markNotificationsAsRead, clearNotifications, ToastContainer } = useNotifications({ currentTimeframe: timeframe });
    
    // --- Alert State ---
    const [alertStates, setAlertStates] = useState<Record<string, any>>(() => {
        try {
            const savedStates = localStorage.getItem('alertStates');
            return savedStates ? JSON.parse(savedStates) : {};
        } catch (error) { return {}; }
    });

    useEffect(() => { localStorage.setItem('alertStates', JSON.stringify(alertStates)); }, [alertStates]);
    
    // --- Effects ---
     useEffect(() => {
        if (isInitializing) {
            const timer = setTimeout(() => {
                setIsInitializing(false);
                sessionStorage.setItem('hasSeenSplash', 'true');
            }, 4500);
            return () => clearTimeout(timer);
        }
    }, [isInitializing]);
    
    // Hybrid Alert System: Immediate check on active timeframe data refresh (every 60s)
    useEffect(() => {
        if (isInitializing || loading || Object.keys(symbolsData).length === 0) {
            return;
        }

        for (const symbol in symbolsData) {
            const data = symbolsData[symbol];
            if (data && data.klines.length > 0) {
                const alerts = checkAllAlerts(symbol, timeframe, data, settings, alertStates, setAlertStates, null);
                alerts.forEach(alert => addNotification(alert, true));
            }
        }
    }, [symbolsData, timeframe, settings, alertStates, addNotification, setAlertStates, isInitializing, loading]);


    // --- Derived State & Memos ---
    const displayedSymbols = useMemo(() => {
        let symbols = showFavoritesOnly ? favorites : userSymbols;
        if (searchTerm) {
            symbols = symbols.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        
        const getSortValue = (symbol: string) => {
            const data = symbolsData[symbol];
            if (!data) return -Infinity;
            switch (sortOrder) {
                case 'rsi-asc':
                case 'rsi-desc':
                    return data.rsi?.[data.rsi.length - 1]?.value ?? -Infinity;
                case 'chg-asc':
                case 'chg-desc':
                    if (!data.klines || data.klines.length < 2) return -Infinity;
                    const change = data.klines[data.klines.length - 1].close - data.klines[0].close;
                    return data.klines[0].close === 0 ? 0 : (change / data.klines[0].close) * 100;
                case 'stoch-asc':
                case 'stoch-desc':
                    return data.stochK?.[data.stochK.length - 1]?.value ?? -Infinity;
                default:
                    return 0;
            }
        };

        if (sortOrder !== 'default') {
            const isAsc = sortOrder.endsWith('-asc');
            symbols.sort((a, b) => {
                const valA = getSortValue(a);
                const valB = getSortValue(b);
                return isAsc ? valA - valB : valB - valA;
            });
        }

        return symbols;
    }, [showFavoritesOnly, favorites, userSymbols, searchTerm, sortOrder, symbolsData]);

    // --- Lock Handlers ---
    const unlockApp = useCallback(() => {
        sessionStorage.setItem('appIsUnlocked', 'true');
        setIsLocked(false);
    }, []);

    // --- UI Handlers ---
    const handleSelectSymbol = (symbol: string, modalType: ActiveModal) => {
        setActiveSymbol(symbol);
        setActiveModal(modalType);
    };

    const handleSelectRsiSymbol = (symbol: string) => handleSelectSymbol(symbol, 'rsi');
    const handleSelectStochSymbol = (symbol: string) => handleSelectSymbol(symbol, 'stoch');
    const handleSelectPriceSymbol = (symbol: string) => handleSelectSymbol(symbol, 'price');
    const handleCloseModal = () => setActiveModal(null);
    const handleSettingsToggle = () => setIsSettingsOpen(prev => !prev);
    const handleSearchChange = (term: string) => setSearchTerm(term);
    
    const handleSwitchToPriceChart = () => setActiveModal('price');
    const handleSwitchToRsiChart = () => setActiveModal('rsi');
    const handleSwitchToStochChart = () => setActiveModal('stoch');
    
    const handleNavigateToFullView = () => {
        handleCloseModal();
        userSettingsHandlers.handleNavigateToFullView();
    };
    
    const handleSaveAndNotify = useCallback((data: { allSymbols: string[]; selectedSymbols: string[]; }) => {
        userSettingsHandlers.handleSaveAssetList(data);
        addNotification({
            symbol: 'System',
            timeframe: 'N/A' as Timeframe,
            type: 'accumulation-volume', // Re-use an existing style for success
            body: 'Asset list updated successfully.'
        }, true);
    }, [userSettingsHandlers, addNotification]);

    const value: AppContextType = {
        isInitializing,
        settings, theme, favorites, userSymbols, allSymbols, showFavoritesOnly, sortOrder, viewMode, page, 
        ...userSettingsHandlers, 
        handleTimeframeChange,
        handleSaveAssetList: handleSaveAndNotify,
        handleNavigateToFullView,
        symbolsData, loading, timeframe, lastDataFetch,
        notifications, activeToast, addNotification, handleToastFinished, markNotificationsAsRead, clearNotifications, ToastContainer,
        activeSymbol, activeModal, isSettingsOpen, isAssetModalOpen, isTradeSignalsModalOpen, isAlertsModalOpen, isPaperTradingOpen,
        handleSelectRsiSymbol, handleSelectStochSymbol, handleSelectPriceSymbol, handleCloseModal,
        handleSettingsToggle,
        setIsSettingsOpen, setIsAssetModalOpen, setIsTradeSignalsModalOpen, setIsAlertsModalOpen, setIsPaperTradingOpen,
        searchTerm, handleSearchChange,
        handleSwitchToPriceChart, handleSwitchToRsiChart, handleSwitchToStochChart,
        displayedSymbols,
        isLocked, unlockApp,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === null) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};