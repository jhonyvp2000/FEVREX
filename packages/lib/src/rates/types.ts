export type Currency = "PEN" | "USD";

export interface ExchangeRate {
    buy: number; // We buy USD (User sells USD)
    sell: number; // We sell USD (User buys USD)
    timestamp: number;
    provider: string;
}

export interface Quote {
    id: string;
    rate: number;
    amountSend: number;
    amountReceive: number;
    currencySend: Currency;
    currencyReceive: Currency;
    expiresAt: Date;
}

export interface IRateProvider {
    getRates(): Promise<ExchangeRate>;
    // Potential methods for historical rates etc.
}
