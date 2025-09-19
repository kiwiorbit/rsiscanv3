
import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import CryptoHeader from './components/CryptoHeader';
import Grid from './components/Grid';
import Heatmap from './components/Heatmap';
import PriceGrid from './components/PriceGrid';
import StochGrid from './components/StochGrid';
import Modal from './components/Modal';
import PriceDetailModal from './components/PriceDetailModal';
import StochDetailModal from './components/StochDetailModal';
import SettingsPanel from './components/SettingsPanel';
import Footer from './components/Footer';
import AssetListModal from './components/AssetListModal';
import FullViewPage from './components/FullViewPage';
import AlertsModal from './components/AlertsModal';
import { TIMEFRAMES } from './constants';
import type { ViewMode } from './types';
import ScreenLock from './components/ScreenLock';

// === Splash Screen Component ===
const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen" aria-live="polite" aria-label="Loading Crypto RSI Scanner">
      <div className="splash-content">
        <svg className="splash-logo" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M 10 70 L 40 20 L 60 60 L 90 10 L 120 70 L 150 30 L 190 60" />
        </svg>
        <h1 className="splash-title">Crypto RSI Scanner</h1>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
    const {
        isInitializing,
        // User Settings
        settings,
        theme,
        favorites,
        userSymbols,
        allSymbols,
        showFavoritesOnly,
        sortOrder,
        viewMode,
        page,
        handleThemeToggle,
        handleSettingChange,
        handleAlertConditionChange,
        toggleFavorite,
        handleShowFavoritesOnlyToggle,
        handleSortChange,
        handleViewModeChange,
        handleSaveAssetList,
        handleNavigateToFullView,
        handleNavigateBack,
        handleResetSettings,
        // Symbol Data
        symbolsData,
        loading,
        timeframe,
        lastDataFetch,
        handleTimeframeChange,
        // Notifications
        activeToast,
        notifications,
        handleToastFinished,
        markNotificationsAsRead,
        clearNotifications,
        ToastContainer,
        // UI State
        activeSymbol,
        activeModal,
        isSettingsOpen,
        isAssetModalOpen,
        isAlertsModalOpen,
        handleSelectRsiSymbol,
        handleSelectStochSymbol,
        handleSelectPriceSymbol,
        handleCloseModal,
        handleSettingsToggle,
        setIsSettingsOpen,
        setIsAssetModalOpen,
        setIsAlertsModalOpen,
        searchTerm,
        handleSearchChange,
        handleSwitchToPriceChart,
        handleSwitchToRsiChart,
        handleSwitchToStochChart,
        displayedSymbols,
        // Lock State
        isLocked,
        unlockApp,
    } = useAppContext();

    if (isInitializing) return <SplashScreen />;
    
    if (page === 'full-view' && activeSymbol && symbolsData[activeSymbol]) {
        return <FullViewPage symbol={activeSymbol} data={symbolsData[activeSymbol]} onBack={handleNavigateBack} settings={settings} timeframe={timeframe} />;
    }

    const getSortButtonContent = () => {
        if (viewMode === 'price') {
            switch (sortOrder) {
                case 'chg-asc': return <>Chg % <i className="fa-solid fa-arrow-up text-xs"></i></>;
                case 'chg-desc': return <>Chg % <i className="fa-solid fa-arrow-down text-xs"></i></>;
                default: return <>Chg %</>;
            }
        }
        if (viewMode === 'stoch') {
            switch (sortOrder) {
                case 'stoch-asc': return <>%K <i className="fa-solid fa-arrow-up text-xs"></i></>;
                case 'stoch-desc': return <>%K <i className="fa-solid fa-arrow-down text-xs"></i></>;
                default: return <>Sort by %K</>;
            }
        }
        switch (sortOrder) {
            case 'rsi-asc': return <>RSI <i className="fa-solid fa-arrow-up text-xs"></i></>;
            case 'rsi-desc': return <>RSI <i className="fa-solid fa-arrow-down text-xs"></i></>;
            default: return <>Sort by RSI</>;
        }
    };
    const isSortActive = sortOrder !== 'default';

    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-dark-text dark:text-light-text font-sans flex flex-col">
            {isLocked && <ScreenLock onUnlock={unlockApp} />}
            <ToastContainer toast={activeToast} onFinish={handleToastFinished} />
            <div className="container mx-auto p-4 flex-grow">
                <CryptoHeader
                    onTimeframeChange={handleTimeframeChange}
                    onSettingsToggle={handleSettingsToggle}
                    timeframe={timeframe}
                    timeframes={TIMEFRAMES}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    notifications={notifications}
                    onClearNotifications={clearNotifications}
                    onMarkNotificationsRead={markNotificationsAsRead}
                    settings={settings}
                />
                <main className="pt-40 md:pt-24">
                    <div className="flex flex-wrap justify-end items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 bg-light-card dark:bg-dark-card p-1 rounded-lg border border-light-border dark:border-dark-border">
                            <button onClick={() => handleViewModeChange('chart')} className={`px-3 py-2 text-sm rounded-md transition ${viewMode === 'chart' ? 'bg-primary-light dark:bg-primary text-white dark:text-dark-bg' : 'text-medium-text-light dark:text-medium-text hover:bg-light-border dark:hover:bg-dark-border'}`} aria-label="RSI Chart View" title="RSI Chart View"><i className="fa-solid fa-chart-line"></i></button>
                            {settings.showStochView && <button onClick={() => handleViewModeChange('stoch')} className={`px-3 py-2 text-sm rounded-md transition ${viewMode === 'stoch' ? 'bg-primary-light dark:bg-primary text-white dark:text-dark-bg' : 'text-medium-text-light dark:text-medium-text hover:bg-light-border dark:hover:bg-dark-border'}`} aria-label="Stochastic RSI View" title="Stochastic RSI View"><i className="fa-solid fa-chart-simple"></i></button>}
                            {settings.showHeatmapView && <button onClick={() => handleViewModeChange('heatmap')} className={`px-3 py-2 text-sm rounded-md transition ${viewMode === 'heatmap' ? 'bg-primary-light dark:bg-primary text-white dark:text-dark-bg' : 'text-medium-text-light dark:text-medium-text hover:bg-light-border dark:hover:bg-dark-border'}`} aria-label="Heatmap View" title="Heatmap View"><i className="fa-solid fa-table-cells"></i></button>}
                            {settings.showPriceView && <button onClick={() => handleViewModeChange('price')} className={`px-3 py-2 text-sm rounded-md transition ${viewMode === 'price' ? 'bg-primary-light dark:bg-primary text-white dark:text-dark-bg' : 'text-medium-text-light dark:text-medium-text hover:bg-light-border dark:hover:bg-dark-border'}`} aria-label="Price Chart View" title="Price Chart View"><i className="fa-solid fa-chart-area"></i></button>}
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={handleShowFavoritesOnlyToggle} className={`px-4 py-2 text-sm font-semibold rounded-lg transition flex items-center gap-2 border ${showFavoritesOnly ? 'bg-primary-light dark:bg-primary text-white dark:text-dark-bg border-transparent' : 'bg-light-card dark:bg-dark-card text-medium-text-light dark:text-medium-text border-light-border dark:border-dark-border hover:bg-light-border dark:hover:bg-dark-border'}`} aria-pressed={showFavoritesOnly} aria-label="Toggle favorites filter">
                                <i className={`fa-star ${showFavoritesOnly ? 'fa-solid' : 'fa-regular'}`}></i>
                            </button>
                            <button onClick={handleSortChange} className={`px-4 py-2 text-sm font-semibold rounded-lg transition flex items-center gap-2 border ${isSortActive ? 'bg-primary-light dark:bg-primary text-white dark:text-dark-bg border-transparent' : 'bg-light-card dark:bg-dark-card text-medium-text-light dark:text-medium-text border-light-border dark:border-dark-border hover:bg-light-border dark:hover:bg-dark-border'}`} aria-label="Cycle sort order">
                                {getSortButtonContent()}
                            </button>
                        </div>
                    </div>
                    {viewMode === 'chart' && <Grid loading={loading} symbols={displayedSymbols} symbolsData={symbolsData} onSelectSymbol={handleSelectRsiSymbol} settings={settings} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    {viewMode === 'stoch' && <StochGrid loading={loading} symbols={displayedSymbols} symbolsData={symbolsData} onSelectSymbol={handleSelectStochSymbol} settings={settings} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    {viewMode === 'heatmap' && <Heatmap loading={loading} symbols={displayedSymbols} symbolsData={symbolsData} onSelectSymbol={handleSelectRsiSymbol} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    {viewMode === 'price' && <PriceGrid loading={loading} symbols={displayedSymbols} symbolsData={symbolsData} onSelectSymbol={handleSelectPriceSymbol} settings={settings} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                </main>
            </div>
            {activeModal === 'rsi' && activeSymbol && symbolsData[activeSymbol] && <Modal symbol={activeSymbol} data={symbolsData[activeSymbol]} onClose={handleCloseModal} settings={settings} timeframe={timeframe} onSwitchToPriceChart={handleSwitchToPriceChart} onNavigateToFullView={handleNavigateToFullView} onSwitchToStochChart={handleSwitchToStochChart} />}
            {activeModal === 'price' && activeSymbol && symbolsData[activeSymbol] && <PriceDetailModal symbol={activeSymbol} data={symbolsData[activeSymbol]} onClose={handleCloseModal} settings={settings} timeframe={timeframe} onSwitchToRsiChart={handleSwitchToRsiChart} onSwitchToStochChart={handleSwitchToStochChart} />}
            {activeModal === 'stoch' && activeSymbol && symbolsData[activeSymbol] && <StochDetailModal symbol={activeSymbol} data={symbolsData[activeSymbol]} onClose={handleCloseModal} settings={settings} timeframe={timeframe} onSwitchToRsiChart={handleSwitchToRsiChart} onSwitchToPriceChart={handleSwitchToPriceChart} />}
            <SettingsPanel 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                onOpenAssetModal={() => setIsAssetModalOpen(true)}
                onOpenAlertsModal={() => setIsAlertsModalOpen(true)}
                onReset={handleResetSettings}
                theme={theme}
                onThemeToggle={handleThemeToggle}
                settings={settings}
                onSettingChange={handleSettingChange}
            />
            <AlertsModal
                isOpen={isAlertsModalOpen}
                onClose={() => setIsAlertsModalOpen(false)}
                settings={settings}
                onAlertConditionChange={handleAlertConditionChange}
            />
            <AssetListModal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} onSave={handleSaveAssetList} allSymbols={allSymbols} currentSymbols={userSymbols} />
            <Footer />
        </div>
    );
}

const App: React.FC = () => (
    <AppProvider>
        <AppContent />
    </AppProvider>
);

export default App;