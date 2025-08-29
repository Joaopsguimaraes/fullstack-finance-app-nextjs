import { toast } from 'sonner'

export interface NotifyOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export class NotifyManager {
  static success(message: string, options?: NotifyOptions): void {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    })
  }

  static error(message: string, options?: NotifyOptions): void {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    })
  }

  static warning(message: string, options?: NotifyOptions): void {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    })
  }

  static info(message: string, options?: NotifyOptions): void {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action,
    })
  }

  static loading(message: string, options?: NotifyOptions): string | number {
    return toast.loading(message, {
      description: options?.description,
      duration: options?.duration,
    })
  }

  static dismiss(toastId?: string | number): void {
    toast.dismiss(toastId)
  }
}

export const notify = {
  success: NotifyManager.success,
  error: NotifyManager.error,
  warning: NotifyManager.warning,
  info: NotifyManager.info,
  loading: NotifyManager.loading,
  dismiss: NotifyManager.dismiss,
}
