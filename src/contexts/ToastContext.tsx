import { ToastContainer } from "@/components/ui/Toast";
import { useCallback, useState } from "react";
import { ToastContext } from "./ToastContextDef";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "warning" | "info";
      title: string;
      message?: string;
      duration?: number;
    }>
  >([]);

  const addToast = useCallback(
    (toast: {
      type: "success" | "error" | "warning" | "info";
      title: string;
      message?: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { ...toast, id }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, clearToasts }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
