import { IRateProvider, ExchangeRate } from "./types";

export class MockRateProvider implements IRateProvider {
    private baseRate: number = 3.75; // Reference Interbank rate mock
    private spreadBuy: number = 0.02; // Margin when buying
    private spreadSell: number = 0.02; // Margin when selling

    async getRates(): Promise<ExchangeRate> {
        // Simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Buy = Base - Spread (We pay less PEN for USD)
        // Sell = Base + Spread (We charge more PEN for USD)

        // Example: Base 3.75
        // Buy: 3.73 (User sells USD, gets 3.73 PEN)
        // Sell: 3.77 (User buys USD, pays 3.77 PEN)

        return {
            buy: parseFloat((this.baseRate - this.spreadBuy).toFixed(4)),
            sell: parseFloat((this.baseRate + this.spreadSell).toFixed(4)),
            timestamp: Date.now(),
            provider: "MOCK_V1",
        };
    }
}
