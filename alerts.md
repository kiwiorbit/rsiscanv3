# Crypto Scanner Alerts Guide

This document provides a detailed overview of all the configurable alerts available in the Crypto RSI Scanner application. All alerts can be individually enabled or disabled in the **Settings > Configure Alerts** modal.

## Timeframe Applicability Summary

Here is a quick reference for which timeframes each alert is active on:

-   **Extreme Alerts:** `15m, 1h, 2h, 4h, 8h, 1d, 1w`
-   **RSI/SMA Cross Alerts:** `15m, 1h, 2h, 4h, 8h, 1d, 3d`
-   **Divergence Alerts:** `1h, 4h, 8h, 1d, 3d`
-   **Stochastic RSI Recovery:** `1h, 2h, 4h, 8h, 1d, 3d`
-   **Stochastic RSI Bullish Cross:** `1h, 2h, 4h, 8h, 1d, 3d`
-   **Price in Golden Pocket:** `1h, 4h, 1d, 3d`
-   **Golden Pocket Reversal w/ Volume:** `1h, 4h, 1d, 3d`
-   **0.786 Fib Zone Reversal:** `1h, 4h, 1d, 3d`
-   **Breakout Volume Surge:** `1h, 4h, 1d, 3d`
-   **Capitulation Volume Reversal:** `1h, 4h, 1d, 3d`
-   **Accumulation Volume:** `1h, 4h, 1d, 3d`
 
## Available Alerts

-   **Extreme Alerts** (Overbought / Oversold)
-   **RSI/SMA Cross Alerts**
-   **Divergence Alerts**
-   **Stochastic RSI Recovery from Zero**
-   **Stochastic RSI Bullish Cross after Recovery**
-   **Price in Golden Pocket**
-   **Golden Pocket Reversal with Volume**
-   **0.786 Fib Zone Reversal**
-   **Breakout Volume Surge**
-   **Capitulation Volume Reversal**
-   **Accumulation Volume**

---

## Explanation of Each Alert

### 1. Extreme Alerts

These are the most fundamental alerts, designed to notify you when an asset's price momentum is reaching a potential point of exhaustion or reversal.

-   **Overbought Alert:** Triggers when a symbol's RSI (Relative Strength Index) crosses **above 70**.
-   **Oversold Alert:** Triggers when a symbol's RSI crosses **below 30**.

*Note: The system is designed to avoid spam. It will only notify you once when an asset enters an extreme state. It will not generate another "overbought" alert for the same asset until its RSI first drops back into the neutral zone (below 70) and then crosses above 70 again.*

-   **Timeframe Applicability:** `15m, 1h, 2h, 4h, 8h, 1d, 1w`

### 2. RSI/SMA Cross Alerts

This alert notifies you of a direct change in momentum as indicated by the relationship between the RSI and its moving average.

-   **Bullish Cross:** Triggers when the RSI line crosses *above* its 14-period Simple Moving Average (SMA).
-   **Death Cross:** Triggers when the RSI line crosses *below* its 14-period SMA.

-   **Timeframe Applicability:** `15m, 1h, 2h, 4h, 8h, 1d, 3d`

### 3. Divergence Alerts

This alert spots discrepancies between price action and momentum, which are often powerful leading indicators of a trend reversal.

-   **Bullish Divergence:** An alert is triggered when the price makes a new low, but the RSI makes a *higher* low.
-   **Bearish Divergence:** An alert is triggered when the price makes a new high, but the RSI makes a *lower* high.

-   **Timeframe Applicability:** `1h, 4h, 8h, 1d, 3d`

### 4. Stochastic RSI Recovery from Zero

This is a highly sensitive, early-warning alert designed to identify potential bottoming signals.

-   **Trigger:** The alert fires when an asset's Stochastic RSI %K value, after hitting absolute zero (0.00), recovers to a value that is greater than 0 but still **below 5**.
-   **Purpose:** Hitting zero on the Stochastic RSI indicates an extremely oversold condition. A recovery from this level can be the very first sign that selling pressure has exhausted and a reversal may be imminent.
-   **Timeframe Applicability:** `1h, 2h, 4h, 8h, 1d, 3d`

### 5. Stochastic RSI Bullish Cross after Recovery

This alert acts as a confirmation signal that follows the "Stochastic RSI Recovery" alert.

-   **Trigger:** This alert fires only when the Stochastic RSI %K line crosses *above* the %D line **after** a "Stochastic RSI Recovery from Zero" alert has already occurred for that same symbol and timeframe.
-   **Purpose:** While the recovery alert is an early warning, the bullish cross provides stronger confirmation that momentum is starting to shift to the upside.
-   **Timeframe Applicability:** `1h, 2h, 4h, 8h, 1d, 3d`

### 6. Price in Golden Pocket

This is a price-based alert that notifies you when an asset is testing a key technical support or resistance zone based on Fibonacci Retracement levels.

-   **Trigger:** The alert fires when the current price of an asset enters the "Golden Pocket," which is the critical zone between the **0.618** and **0.65** Fibonacci retracement levels.
-   **Calculation:** The Fibonacci levels are calculated automatically based on the highest high and lowest low of the visible candles on the current chart.
-   **Purpose:** The Golden Pocket is widely watched by traders as a high-probability area for a price trend to either reverse or experience a significant bounce.
-   **Timeframe Applicability:** `1h, 4h, 1d, 3d`.

### 7. Golden Pocket Reversal with Volume

This is an advanced confirmation alert that combines price action at a key level with volume analysis.

-   **Trigger:** This alert fires when the price, after being inside the Golden Pocket, moves *out* of the zone, and this reversal is confirmed by **three consecutive candles of increasing volume**.
-   **Purpose:** A reversal from a key Fibonacci level on rising volume indicates strong market participation and conviction behind the move, increasing the probability that the reversal is genuine.
-   **Timeframe Applicability:** `1h, 4h, 1d, 3d`.

### 8. 0.786 Fib Zone Reversal

This alert identifies potential reversals at another critical Fibonacci retracement level, often considered a last line of defense for a trend.

-   **Trigger:** This alert fires when the price enters the zone around the **0.786 Fibonacci level** and then moves back out, signaling a reaction.
-   **Purpose:** A bounce or rejection from the 0.786 level can indicate a strong trend continuation or a deep retracement before a reversal. This alert helps you spot these critical reactions automatically.
-   **Timeframe Applicability:** `1h, 4h, 1d, 3d`.

### 9. Breakout Volume Surge

This is a high-conviction alert that identifies a potential new trend powered by strong market participation.

-   **Trigger:** The alert fires when the price breaks and closes above a recent swing high (highest high of the last 20 candles) and the volume on that breakout candle is more than **200%** of the average volume of the last 20 candles.
-   **Purpose:** A breakout accompanied by a massive surge in volume confirms strong buying interest and suggests the move has enough momentum to continue, reducing the likelihood of a "fakeout."
-   **Timeframe Applicability:** `1h, 4h, 1d, 3d`.

### 10. Capitulation Volume Reversal

This alert attempts to identify a market bottom by spotting signs of extreme selling exhaustion.

-   **Trigger:** The alert fires on a candle that meets three criteria:
    1.  It is a long red candle (its body is >150% of the recent average).
    2.  The volume is massive (more than **300%** of the recent average).
    3.  The price is in a general downtrend.
-   **Purpose:** This combination often signals "capitulation," where the last of the weak-hand sellers are flushed out in a panic-selling climax. This moment of maximum pessimism is often a precursor to a sharp trend reversal.
-   **Timeframe Applicability:** `1h, 4h, 1d, 3d`.

### 11. Accumulation Volume

This is a more subtle, early-warning alert designed to detect when institutional or "smart money" may be quietly building a large position during a sideways market.

-   **Trigger:** The alert fires when, over the last 20 candles, two conditions are met:
    1.  The price is trading sideways within a relatively tight range (the range from the period's high to low is less than 10% of the period's **average price**).
    2.  The average volume on "up" candles (where the close is higher than the open) is consistently and significantly higher (at least **175%**) than the average volume on "down" candles.
-   **Purpose:** This pattern suggests that buying interest is stronger than selling pressure, even though the price isn't moving much yet. It can be an early indicator of a potential major upward move before the actual breakout occurs.
-   **Timeframe Applicability:** `1h, 4h, 1d, 3d`.