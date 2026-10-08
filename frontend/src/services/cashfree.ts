import api from './api'

declare global {
  interface Window {
    Cashfree?: any
  }
}

let cashfreeInstance: any = null

export interface CreateCashfreeOrderPayload {
  serviceName: string
  amount: number
  clientName: string
  clientEmail: string
  clientPhone: string
  notes?: string
}

export interface CashfreeOrderResponse {
  success: boolean
  orderId: string
  paymentSessionId: string
  orderStatus: string
  environment: string
  amount: number
  currency: string
  message?: string
}

export interface CashfreeVerifyResponse {
  orderId: string
  cfOrderId?: string
  orderStatus: string
  paid: boolean
  amount: number
  currency: string
  message: string
}

export interface CashfreeCheckoutResult {
  error?: any
  redirect?: boolean
  paymentDetails?: {
    paymentMessage?: string
    [key: string]: any
  }
}

/**
 * Loads and initializes the Cashfree JS SDK v3
 */
export async function loadCashfreeSDK(mode: 'production' | 'sandbox' = 'production'): Promise<any> {
  if (window.Cashfree) {
    if (!cashfreeInstance) {
      cashfreeInstance = window.Cashfree({ mode })
    }
    return cashfreeInstance
  }

  return new Promise((resolve, reject) => {
    // Check if script tag already exists
    const existing = document.querySelector('script[src*="cashfree.js"]')
    if (existing) {
      const checkInterval = setInterval(() => {
        if (window.Cashfree) {
          clearInterval(checkInterval)
          cashfreeInstance = window.Cashfree({ mode })
          resolve(cashfreeInstance)
        }
      }, 100)

      setTimeout(() => {
        clearInterval(checkInterval)
        if (!cashfreeInstance && !window.Cashfree) {
          reject(new Error('Cashfree SDK load timeout'))
        }
      }, 7000)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true
    script.onload = () => {
      try {
        if (window.Cashfree) {
          cashfreeInstance = window.Cashfree({ mode })
          resolve(cashfreeInstance)
        } else {
          reject(new Error('Cashfree SDK object missing after script load'))
        }
      } catch (e) {
        reject(e)
      }
    }
    script.onerror = () => reject(new Error('Failed to load Cashfree script from CDN'))
    document.body.appendChild(script)
  })
}

/**
 * Creates an order on Cashfree PG via BrandIt backend
 */
export async function createCashfreeOrder(payload: CreateCashfreeOrderPayload): Promise<CashfreeOrderResponse> {
  const origin = window.location.origin
  const response = await api.post<CashfreeOrderResponse>('/payments/cashfree/create-order', payload, {
    headers: {
      Origin: origin,
    },
  })
  return response.data
}

export interface VerifyCashfreeOrderPayload {
  orderId: string
  clientEmail?: string
  clientName?: string
  clientPhone?: string
  serviceName?: string
  bookingDate?: string
  bookingTime?: string
  notes?: string
}

/**
 * Verifies the payment status with Cashfree via BrandIt backend and auto-generates booking in Admin Panel
 */
export async function verifyCashfreeOrder(
  payloadOrOrderId: string | VerifyCashfreeOrderPayload,
  clientEmail?: string,
  serviceName?: string
): Promise<CashfreeVerifyResponse> {
  let body: Record<string, any>
  if (typeof payloadOrOrderId === 'string') {
    body = {
      orderId: payloadOrOrderId,
      clientEmail,
      serviceName,
    }
  } else {
    body = payloadOrOrderId
  }

  const response = await api.post<CashfreeVerifyResponse>('/payments/cashfree/verify-order', body)
  return response.data
}
