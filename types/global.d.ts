// Midtrans Snap window type
interface SnapWindow {
  snap: {
    pay: (token: string, options?: {
      onSuccess?: (result: any) => void
      onPending?: (result: any) => void
      onError?: (result: any) => void
      onClose?: () => void
    }) => void
  }
}

declare global {
  interface Window extends SnapWindow {}
}

export {}