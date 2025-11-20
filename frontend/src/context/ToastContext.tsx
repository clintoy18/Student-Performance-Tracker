import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
    const id = `${Date.now()}-${Math.random()}`;
    const toast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const getToastStyles = (type: ToastType) => {
    const styles = {
      success: {
        container: 'bg-green-50 border-green-200 text-green-800',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        progress: 'bg-green-500'
      },
      error: {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        progress: 'bg-red-500'
      },
      info: {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: <Info className="w-5 h-5 text-blue-600" />,
        progress: 'bg-blue-500'
      },
      warning: {
        container: 'bg-amber-50 border-amber-200 text-amber-800',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        progress: 'bg-amber-500'
      }
    };
    return styles[type];
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`${styles.container} min-w-[320px] max-w-md border rounded-lg shadow-lg pointer-events-auto animate-slide-in-right`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {styles.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-relaxed break-words">
                      {toast.message}
                    </p>
                  </div>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Progress bar */}
              {toast.duration && toast.duration > 0 && (
                <div className="h-1 bg-black bg-opacity-5 overflow-hidden">
                  <div
                    className={`h-full ${styles.progress} animate-progress`}
                    style={{
                      animationDuration: `${toast.duration}ms`
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-progress {
          animation: progress linear;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};