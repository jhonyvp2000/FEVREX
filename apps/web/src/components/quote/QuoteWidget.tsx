"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from "@fevrex/ui";
import { ExchangeRate } from "@fevrex/lib";
import { ArrowRightLeft, RefreshCw } from "lucide-react";

export function QuoteWidget() {
    const [rates, setRates] = useState<ExchangeRate | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"BUY" | "SELL">("BUY"); // User Perspective: BUY USD (Pay PEN)
    const [amountSend, setAmountSend] = useState<string>("1000"); // Default 1000
    const [amountReceive, setAmountReceive] = useState<string>("0");

    const MAX_DECIMALS = 2;

    useEffect(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 30000); // 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        calculate();
    }, [rates, tab, amountSend]);

    const fetchRates = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/rates");
            const data = await res.json();
            setRates(data);
        } catch (error) {
            console.error("Failed to fetch rates", error);
        } finally {
            setLoading(false);
        }
    };

    const calculate = () => {
        if (!rates || !amountSend) return;

        const val = parseFloat(amountSend);
        if (isNaN(val)) {
            setAmountReceive("");
            return;
        }

        // Sell Price (User Buys USD): We use rate.sell. (e.g. 3.77)
        // Buy Price (User Sells USD): We use rate.buy. (e.g. 3.73)

        // Formula:
        // BUY USD: User sends PEN. Receive USD = PEN / SellRate
        // SELL USD: User sends USD. Receive PEN = USD * BuyRate

        let result = 0;
        if (tab === "BUY") {
            result = val / rates.sell;
        } else {
            result = val * rates.buy;
        }

        setAmountReceive(result.toFixed(MAX_DECIMALS));
    };

    const handleSwitch = () => {
        setTab(tab === "BUY" ? "SELL" : "BUY");
        // Also logic to swap amounts could go here, but keeping it simple
    };

    if (!rates) return <Card className="w-full max-w-md p-6"><div className="animate-pulse h-40 bg-slate-800 rounded"></div></Card>;

    return (
        <Card className="w-full max-w-md border-slate-700 bg-slate-800 text-slate-100 shadow-xl">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-amber-500 font-bold">
                        {tab === "BUY" ? "Comprar Dólares" : "Vender Dólares"}
                    </CardTitle>
                    <div className="flex space-x-4 text-sm font-mono">
                        <div className="flex flex-col items-end">
                            <span className="text-slate-400 text-xs">Compra</span>
                            <span className="font-bold">{rates.buy.toFixed(3)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-slate-400 text-xs">Venta</span>
                            <span className="font-bold">{rates.sell.toFixed(3)}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Toggle / Tabs */}
                <div className="flex bg-slate-900 p-1 rounded-lg mb-4">
                    <button
                        onClick={() => setTab("BUY")}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === "BUY" ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Quiero Dólares (S/ &rarr; $)
                    </button>
                    <button
                        onClick={() => setTab("SELL")}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === "SELL" ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Tengo Dólares ($ &rarr; S/)
                    </button>
                </div>

                {/* Amount Send */}
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-medium">Tú envías</label>
                    <div className="relative">
                        <Input
                            type="number"
                            value={amountSend}
                            onChange={(e) => setAmountSend(e.target.value)}
                            className="bg-slate-900 border-slate-700 text-lg font-bold pr-16"
                        />
                        <span className="absolute right-3 top-2 font-bold text-slate-500">
                            {tab === "BUY" ? "PEN" : "USD"}
                        </span>
                    </div>
                </div>

                {/* Calculated Receive */}
                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-medium">Tú recibes</label>
                    <div className="relative">
                        <Input
                            disabled
                            value={amountReceive}
                            className="bg-slate-900/50 border-slate-700 text-lg font-bold pr-16 text-emerald-400 opacity-100 disabled:opacity-100"
                        />
                        <span className="absolute right-3 top-2 font-bold text-slate-500">
                            {tab === "BUY" ? "USD" : "PEN"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                        <span>Tipo de Cambio usado: {tab === "BUY" ? rates.sell : rates.buy}</span>
                        <Button variant="ghost" size="icon" className="h-4 w-4" onClick={fetchRates}><RefreshCw className={loading ? "animate-spin" : ""} size={12} /></Button>
                    </div>
                </div>

                <Button
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-lg mt-4 h-12"
                    onClick={() => {
                        // Redirect to create order page with pre-filled values
                        window.location.href = `/dashboard/orders/create?mode=${tab}&amount=${amountSend}`;
                    }}
                >
                    Comenzar Operación
                </Button>
            </CardContent>
        </Card>
    );
}
