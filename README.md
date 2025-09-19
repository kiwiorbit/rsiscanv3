
# Crypto RSI Scanner & Advanced Trading Tool

Crypto RSI Scanner is a comprehensive, real-time dashboard and analysis tool designed for cryptocurrency traders. It provides a powerful interface to monitor the Relative Strength Index (RSI), Stochastic RSI, price action, and key volume metrics for hundreds of trading pairs from the Binance exchange.

What began as a simple RSI scanner has evolved into an advanced charting platform, complete with institutional-grade indicators like Volume Profile and advanced, strategy-based alerts, all within a sleek, customizable, and responsive web interface.

## Core Features

### 1. Multi-View Dashboard

Instantly get a market overview with four distinct and switchable dashboard views:

-   **📈 RSI Chart View (Default):** A grid of mini RSI charts, each showing the RSI line, its 14-period Simple Moving Average (SMA), and key overbought (70) and oversold (30) levels.
-   **➿ Stochastic RSI View:** A grid displaying mini Stochastic RSI charts, visualizing the %K and %D lines to pinpoint overbought/oversold conditions with greater sensitivity.
-   **♨️ Heatmap View:** A color-coded grid that provides an immediate, at-a-glance understanding of market sentiment. Cells range from deep green (extremely oversold) to bright red (extremely overbought).
-   **💹 Price View:** A grid of mini price charts that visualize the recent price action for each symbol, color-coded based on the period's price change.

### 2. Advanced Interactive Charting Modal

Clicking on any symbol opens a powerful modal with in-depth analysis tools:

-   **Multi-Indicator Chart Panes:** Seamlessly switch between a detailed Price Chart, an RSI Chart, and a Stochastic RSI chart.
-   **Interactive Drawing Tools:** Draw trendlines or make free-form annotations directly on the charts to mark areas of interest.
-   **Sophisticated Technical Indicators:**
    -   📊 **Volume Profile:** A vertical histogram on the price chart showing the volume traded at different price levels, clearly visualizing the Point of Control (POC), Value Area High (VAH), and Value Area Low (VAL).
    -   **Golden Pocket:** Toggle a visual overlay that highlights the key Fibonacci Retracement zone (between 0.618 and 0.65).
    -   **Higher-Timeframe (HTF) Levels:** Overlay crucial support and resistance levels from the *previous week* and *previous month*.

### 3. Full Screen Analysis Mode

For an even more focused analysis, expand the modal into a dedicated **Full View Page**. This mode features:
-   A large, two-pane layout with the Price Chart on top and the RSI Chart below.
-   Synchronized crosshairs and data tooltips across both charts.
-   **Chart Capture:** Copy a clean, high-resolution image of the entire chart view (including your drawings) directly to your clipboard to share your analysis.

### 4. Advanced Alerts & Notifications

Stay ahead of market moves with a powerful, customizable alert system managed from a dedicated **"Configure Alerts" modal**:
-   **Indicator-Based Alerts:**
    -   **Extreme Alerts:** Get notified when RSI is overbought (>70) or oversold (<30).
    -   **Cross & Divergence Alerts:** Get alerts for RSI/SMA crosses and bullish/bearish divergences.
-   **Advanced Strategy Alerts:**
    -   **Stochastic RSI Recovery:** An early warning when the Stoch RSI hits zero and begins to recover.
    -   **Stochastic RSI Bullish Cross:** A confirmation signal when the %K crosses above %D after a recovery.
    -   **Price in Golden Pocket:** Be notified when the price enters the critical 0.618-0.65 Fibonacci retracement zone.
-   **Volume & Price Action Alerts:** Get notified about Breakout Volume, Capitulation Volume, and Accumulation Volume patterns.
-   **Notification Center:** A persistent panel accessible from the header that stores a history of all recent alerts.

### 5. Powerful Filtering & Sorting

Quickly find the assets that matter most:

-   **Symbol Search:** A quick-access search bar to instantly filter for any symbol.
-   **Favorites System:** Star your most-watched assets and toggle a "favorites-only" view.
-   **Dynamic Sorting:** Sort all symbols by RSI value, by 24-hour price change, or by Stochastic %K value (ascending or descending).

### 6. Deep Customization

Tailor the application to your exact preferences:

-   **Full Asset Management:** Add, remove, and select exactly which symbols you want to actively monitor on the dashboard.
-   **Theme Engine:** Switch between a sleek **Dark Mode** and a clean **Light Mode**.
-   **Dedicated Alert Modal:** Configure all alert settings in a clean, dedicated modal.
-   **Reset to Default:** A one-click option to restore all settings and assets to their original state.

## Tech Stack

-   **Frontend:** Built with **React** and **TypeScript** for a robust, scalable, and maintainable codebase.
-   **Styling:** Styled with **Tailwind CSS**, a utility-first framework for rapid and consistent UI development.
-   **Charting:** Powered by **Recharts**, a composable charting library for React.
-   **Data Source:** Fetches real-time K-line (candlestick) data directly from the public **Binance API**.
-   **Image Generation:** Uses the **`html-to-image`** library to capture DOM elements as images for the "Copy to Clipboard" feature.