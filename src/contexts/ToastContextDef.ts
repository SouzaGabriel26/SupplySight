import type { ToastType } from "@/components/ui/Toast";
import { createContext } from "react";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
