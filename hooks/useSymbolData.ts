
import { useState, useEffect, useCallback, useRef } from 'react';
import type { SymbolData, Timeframe } from '../types';
import { fetchRsiForSymbol } from '../services/binanceService';

const DATA_FETCH_INTERVAL = 60000; // 1 minute

const useSymbolData = ({ userSymbols, timeframe }: { userSymbols: string[], timeframe: Timeframe }) => {
    const [symbolsData, setSymbolsData] = useState<Record<string, SymbolData>>({});
    const [loading, setLoading] = useState(true);
    const [lastDataFetch, setLastDataFetch] = useState<Date | null>(null);
    const fetchControllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (isInitialLoad: boolean = false) => {
        if (fetchControllerRef.current) {
            fetchControllerRef.current.abort();
        }
        fetchControllerRef.current = new AbortController();
        const { signal } = fetchControllerRef.current;
        
        if (isInitialLoad) {
            setLoading(true);
        }

        try {
            const promises = userSymbols.map(symbol => fetchRsiForSymbol(symbol, timeframe, 80));
            const results = await Promise.all(promises);
            
            if (signal.aborted) return;

            const newData: Record<string, SymbolData> = {};
            results.forEach((data, index) => {
                newData[userSymbols[index]] = data;
            });
            
            setSymbolsData(newData);
            setLastDataFetch(new Date());

        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error("Failed to fetch symbol data:", error);
            }
        } finally {
             if (!signal.aborted && isInitialLoad) {
                setLoading(false);
            }
        }
    }, [userSymbols, timeframe]);

    useEffect(() => {
        fetchData(true);
    }, [timeframe, userSymbols, fetchData]);

    useEffect(() => {
        const interval = setInterval(() => fetchData(false), DATA_FETCH_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchData]);
    
    return { symbolsData, loading, lastDataFetch };
};

export default useSymbolData;
