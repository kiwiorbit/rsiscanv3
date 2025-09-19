
# How to Rebuild the Paper Trading Bot: A Step-by-Step AI Prompt Guide

This guide provides a series of sequential prompts designed to be given to a generative AI agent to re-implement the advanced paper trading functionality from scratch.

---

### Prompt 1: Foundation & UI Shell

**User Prompt:**
"First, let's build the foundation for the paper trading feature.
1.  Define the basic data structures in `types.ts`. Create interfaces for `Trade` (id, symbol, side, price, quantity, timestamp, timeframe, etc.) and `Position` (symbol, quantity, averageEntryPrice, trades, timeframe).
2.  Create a new component `components/PaperTradingPanel.tsx`. This should be a slide-out panel that can be toggled open or closed. Inside, create a UI with a header, a master 'Auto-Trading' toggle, two tabs ('Open Positions' and 'Trade History'), and a footer to display P&L. For now, use placeholder data.
3.  In `components/CryptoHeader.tsx`, add a 'briefcase' icon button that will toggle the visibility of this new panel."

---

### Prompt 2: State Management with a Custom Hook

**User Prompt:**
"Now, let's manage the trading state.
1.  Create a new custom hook `hooks/usePaperTrading.ts`.
2.  Inside this hook, create state for `trades` and `openPositions` using `useState`. Use the `localStorage` utility to persist both of these state variables.
3.  Add a `useEffect` hook that recalculates `openPositions` whenever the `trades` array changes. This logic should iterate through all trades, group them by symbol and timeframe, and calculate the final quantity and average entry price for any positions that are still open.
4.  The hook should return the `trades`, `openPositions`, and their respective setter functions."

---

### Prompt 3: Core Trading Logic

**User Prompt:**
"Let's implement the core logic for executing trades.
1.  In the `usePaperTrading` hook, create a `handleTrade` function. It should accept parameters like `symbol`, `side`, `price`, `reason`, etc.
2.  This function should create a new `Trade` object and add it to the `trades` array. If it's a 'buy' trade, it should create a new `Position`. If it's a 'sell' trade, it should find the corresponding open position, reduce its quantity, and remove it from `openPositions` if the quantity becomes zero.
3.  Create a `handleClosePosition` function that calls `handleTrade` with `side: 'sell'` and the full quantity of the position.
4.  Also, add state for `isAutoTradingEnabled` (persisted to localStorage) and a toggle function for it."

---

### Prompt 4: Trading Strategy Modal UI

**User Prompt:**
"Create the UI for configuring the bot's strategy.
1.  In `types.ts`, define `TradeConditions` (nested objects for 'buy' and 'sell' signals) and `ActiveStrategy` (a string literal type for 'none', 'manual', 'strategy-b', etc.). Add these to the global `Settings` type.
2.  Create a new component `components/TradeSignalsModal.tsx`. This should be a modal window.
3.  Inside, add a 'Strategy Selector' with radio buttons for 'Off', 'Manual Configuration', 'Strategy B', and 'Confluence Reversal Strategy'.
4.  Below the selector, add sections for 'Active Timeframe', 'Buy Conditions', and 'Sell Conditions'. Populate these with toggle switches for each manual rule (e.g., 'Combined Oversold', 'Bullish Cross', 'Overbought', 'Death Cross'). These manual options should be visually disabled when a preset strategy is selected."

---

### Prompt 5: Connecting Strategy State

**User Prompt:**
"Now, wire up the strategy modal to the application's state.
1.  In `context/AppContext.tsx`, manage the `tradeConditions` as part of the main `settings` state.
2.  Create handler functions (`handleTradeConditionChange`, `handleActiveStrategyChange`, `handleAutoTradeTimeframeChange`) and pass them to the `TradeSignalsModal`.
3.  When a preset strategy (like 'Strategy B') is selected, the `handleActiveStrategyChange` function should automatically update the `allowedAutoTradeTimeframes` in the settings to reflect the strategy's ideal timeframes (e.g., '1h', '4h', '1d').
4.  In `components/SettingsPanel.tsx`, add a 'Trading Strategy' button that opens the `TradeSignalsModal`."

---

### Prompt 6: Implementing Trading Logic Service

**User Prompt:**
"Let's centralize the trading logic.
1.  Create a new service file `services/tradingService.ts`.
2.  Create two main functions: `checkBuySignals` and `checkSellSignals`. These functions will take the symbol data, settings, and current position (for sells) as arguments.
3.  Implement the logic for the **'Manual Configuration'** strategy first. Inside `checkBuySignals`, check for the conditions you defined (e.g., if `settings.tradeConditions.buy.combinedOversold` is true, check if RSI and Stoch are below their thresholds). Do the same for all manual rules in `checkSellSignals`. The functions should return an object with a `reason` if a signal is found, or `null` otherwise."

---

### Prompt 7: Implementing Advanced Preset Strategy Logic

**User Prompt:**
"Now, let's build the logic for the advanced strategies in `services/tradingService.ts`.
1.  These strategies need to remember their state ('watching' vs 'armed'). In `AppContext`, create a new state variable `strategyStates` and persist it to localStorage.
2.  In `checkBuySignals`, add `else if` blocks for `activeStrategy === 'strategy-b'` and `activeStrategy === 'confluence-reversal'`.
3.  Implement the two-phase state machine logic for each. For example, for 'Strategy B', if no state exists, check for the setup condition (e.g., RSI < 25). If found, update `strategyStates` to set the phase to 'armed'. If the state is 'armed', check for the multi-part trigger condition (lower low, volume surge, etc.). If triggered, return the buy signal and clear the state.
4.  Do the same for the exit logic in `checkSellSignals`, implementing the multi-stage, partial take-profit rules."

---

### Prompt 8: Background Monitoring Engine

**User Prompt:**
"Implement a persistent background monitoring process for the bot.
1.  In `context/AppContext.tsx`, create a `useEffect` hook that sets up a `setInterval` to run a `backgroundTask` function every minute when `isAutoTradingEnabled` is true.
2.  The `backgroundTask` function must be `async` and should do two things:
    a. **Risk Management:** Iterate through all current `openPositions`. For each one, `await` a fetch of the latest data for its *specific entry timeframe*. Then, call `checkSellSignals` with this data to see if an exit is warranted.
    b. **Opportunity Scanning:** Get the list of all timeframes enabled by the user's strategy. Iterate through all symbols on each of these timeframes, `await`ing fresh data for each one. Call `checkBuySignals` to look for new trade entries.
3.  Ensure the `setInterval` is properly cleared in the `useEffect` cleanup function."

---

### Prompt 9: Final Polish & Notifications

**User Prompt:**
"Finally, let's integrate the trading feature with the rest of the UI.
1.  In the `usePaperTrading` hook, ensure the `handleTrade` function calls the global `addNotification` function whenever a trade is executed. Create specific notification types for `'auto-trade-buy'` and `'auto-trade-sell'`.
2.  In `services/notificationService.ts`, add cases for these new types to provide descriptive toast and panel messages, including the reason for the trade.
3.  Update the `PaperTradingPanel` to display the real `openPositions` and `tradeHistory` from the `usePaperTrading` hook, ensuring all data like P&L is calculated and displayed correctly."

