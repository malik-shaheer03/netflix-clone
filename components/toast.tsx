"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle, CheckCircle, Info } from "lucide-react"

export type ToastType = "error" | "success" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  const getIcon = () => {
    switch (toast.type) {
      case "error":
        return <AlertCircle className="w-5 h-5" />
      case "success":
        return <CheckCircle className="w-5 h-5" />
      case "info":
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = () => {
    switch (toast.type) {
      case "error":
        return "bg-[#e87c03] border-[#f5a623]"
      case "success":
        return "bg-green-600 border-green-500"
      case "info":
        return "bg-blue-600 border-blue-500"
    }
  }

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-md shadow-lg border-l-4 text-white min-w-[320px] max-w-md animate-slideIn ${getStyles()}`}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <span className="font-medium text-sm">{toast.message}</span>
      </div>
      <button onClick={() => onRemove(toast.id)} className="text-white hover:text-gray-200 transition-colors ml-4">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100000] space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

// Toast hook for easy usage
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType = "info", duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, message, type, duration }
    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    addToast,
    removeToast,
    showError: (message: string, duration?: number) => addToast(message, "error", duration),
    showSuccess: (message: string, duration?: number) => addToast(message, "success", duration),
    showInfo: (message: string, duration?: number) => addToast(message, "info", duration),
  }
}
