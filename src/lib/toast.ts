import { toast } from 'sonner'

export interface ToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export class ToastManager {
  static success(message: string, options?: ToastOptions): void {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    })
  }

  static error(message: string, options?: ToastOptions): void {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    })
  }

  static warning(message: string, options?: ToastOptions): void {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    })
  }

  static info(message: string, options?: ToastOptions): void {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    })
  }

  static loading(message: string, options?: ToastOptions): string | number {
    return toast.loading(message, {
      description: options?.description,
      duration: options?.duration,
    })
  }

  static dismiss(toastId?: string | number): void {
    toast.dismiss(toastId)
  }
}

export const showToast = {
  success: ToastManager.success,
  error: ToastManager.error,
  warning: ToastManager.warning,
  info: ToastManager.info,
  loading: ToastManager.loading,
  dismiss: ToastManager.dismiss,
}
