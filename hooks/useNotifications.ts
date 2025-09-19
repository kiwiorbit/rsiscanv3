import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Notification, Timeframe } from '../types';
import { getNotificationDetails } from '../services/notificationService';

const NOTIFICATION_LIMIT = 50;

interface ToastNotificationProps {
  toast: Notification;
  onRemove: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const removeRef = useRef(onRemove);
    removeRef.current = onRemove;

    useEffect(() => {
        const enterTimeout = requestAnimationFrame(() => setIsVisible(true));
        const exitTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => removeRef.current(), 500);
        }, 7000);

        return () => {
            cancelAnimationFrame(enterTimeout);
            clearTimeout(exitTimer);
        };
    }, [toast.id]);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => removeRef.current(), 500);
    }, []);

    const { icon, title, body, accentColor, iconColor } = getNotificationDetails(toast);
  
    return React.createElement(
        "div",
        {
            className: `transform transition-all duration-500 ease-in-out relative w-full max-w-sm p-3 overflow-hidden rounded-xl shadow-2xl bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-lg border border-light-border/50 dark:border-dark-border/50 text-dark-text dark:text-light-text ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`,
            role: "alert",
            "aria-live": "assertive",
        },
        React.createElement("div", {
            className: `absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`,
        }),
        React.createElement(
            "div",
            { className: "flex items-start pl-3" },
            React.createElement(
                "div",
                { className: "flex-shrink-0 pt-0.5" },
                React.createElement("i", {
                    className: `fa-solid ${icon} text-xl ${iconColor}`,
                })
            ),
            React.createElement(
                "div",
                { className: "ml-3 flex-1" },
                React.createElement("p", { className: "text-sm font-bold" }, title),
                React.createElement("p", { className: "mt-1 text-xs" }, body)
            ),
            React.createElement(
                "div",
                { className: "ml-4 flex-shrink-0 flex" },
                React.createElement(
                    "button",
                    {
                        onClick: handleClose,
                        className:
                            "inline-flex text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text focus:outline-none",
                        "aria-label": "Close",
                    },
                    React.createElement("i", { className: "fa-solid fa-xmark" })
                )
            )
        )
    );
};

export const ToastContainer: React.FC<{ toast: Notification | null; onFinish: () => void }> = ({ toast, onFinish }) => (
    React.createElement(
        "div",
        {
            className: "fixed top-2 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 space-y-3",
        },
        toast ? React.createElement(ToastNotification, {
            key: toast.id,
            toast: toast,
            onRemove: onFinish,
        }) : null
    )
);

interface UseNotificationsProps {
    currentTimeframe: Timeframe;
}

const useNotifications = ({ currentTimeframe }: UseNotificationsProps) => {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        try {
            const saved = localStorage.getItem('notifications');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [toastQueues, setToastQueues] = useState<Record<string, Notification[]>>({});
    const [activeToast, setActiveToast] = useState<Notification | null>(null);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);
    
    // Queue processing logic
    useEffect(() => {
        // If there's no active toast AND the queue for the CURRENT timeframe has items...
        if (!activeToast && toastQueues[currentTimeframe] && toastQueues[currentTimeframe].length > 0) {
            // Get the next toast from the current timeframe's queue (new toasts are prepended)
            const [nextToast, ...remainingQueue] = toastQueues[currentTimeframe];
            
            // Set it as the active toast
            setActiveToast(nextToast);
            
            // Update the queues state, removing the toast we just processed
            setToastQueues(prevQueues => ({
                ...prevQueues,
                [currentTimeframe]: remainingQueue,
            }));
        }
    }, [activeToast, toastQueues, currentTimeframe]);

    const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read'>, showToast: boolean = false) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now() + Math.random(),
            read: false,
        };
        
        setNotifications(prev => [newNotification, ...prev].slice(0, NOTIFICATION_LIMIT));
        
        if (showToast) {
            // Add to the specific queue for its timeframe
            setToastQueues(prevQueues => {
                const queueForTimeframe = prevQueues[newNotification.timeframe] || [];
                return {
                    ...prevQueues,
                    // Add new notification to the TOP of the queue
                    [newNotification.timeframe]: [newNotification, ...queueForTimeframe],
                };
            });
        }
    }, []);

    const handleToastFinished = useCallback(() => {
        setActiveToast(null);
    }, []);
    
    const markNotificationsAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return { notifications, activeToast, addNotification, handleToastFinished, markNotificationsAsRead, clearNotifications, ToastContainer };
};

export default useNotifications;