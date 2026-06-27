declare module 'midtrans-client' {
  export interface CoreApi {
    charge(transactionToken: any): Promise<any>
    status(orderId: string): Promise<any>
    approve(orderId: string): Promise<any>
    cancel(orderId: string): Promise<any>
    expire(orderId: string): Promise<any>
    refund(orderId: string, refundParams: any): Promise<any>
  }

  export interface Snap {
    createTransactionToken(parameter: any): Promise<string>
    createTransactionPage(parameter: any): Promise<string>
  }

  export interface MidtransOptions {
    isProduction?: boolean
    serverKey?: string
    clientKey?: string
  }

  export class CoreApi {
    constructor(options: MidtransOptions)
    transaction: {
      status(orderId: string): Promise<any>
      approve(orderId: string): Promise<any>
      cancel(orderId: string): Promise<any>
      expire(orderId: string): Promise<any>
      refund(orderId: string, refundParams: any): Promise<any>
    }
    charge(transactionToken: any): Promise<any>
  }

  export class Snap {
    constructor(options: MidtransOptions)
    createTransactionToken(parameter: any): Promise<string>
    createTransactionPage(parameter: any): Promise<string>
    createTransaction(parameter: any): Promise<{ token: string; redirect_url: string }>
  }

  export default {
    CoreAPI,
    CoreApi,
    Snap,
  }
}