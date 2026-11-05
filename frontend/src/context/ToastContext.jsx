import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          let bg = 'bg-[#12355b] border-[#234e70] text-white';
          let icon = 'ℹ️';

          if (toast.type === 'success') {
            bg = 'bg-[#16856b] border-[#136f59] text-white';
            icon = '✓';
          } else if (toast.type === 'error') {
            bg = 'bg-[#b42323] border-[#911d1d] text-white';
            icon = '✕';
          } else if (toast.type === 'warning') {
            bg = 'bg-[#b45309] border-[#92400e] text-white';
            icon = '⚠️';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl text-xs font-semibold tracking-wide transition-all duration-300 animate-slide-up ${bg}`}
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs font-bold">
                {icon}
              </span>
              <span className="flex-1 leading-snug">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 text-xs ml-1 font-bold"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

