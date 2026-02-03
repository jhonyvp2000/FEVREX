"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Card, CardContent, Input, Button } from "@fevrex/ui";
import { createOrder } from "@/actions/orders";

type Account = {
    id: string;
    alias: string;
    bankName: string;
    currency: string;
    accountNumber: string;
};

export function NewOrderForm({ accounts }: { accounts: Account[] }) {
    // const [state, action] = useFormState(createOrder, null); 
    // Simplified for MVP without comprehensive server-side error handling feedback loop in UI state just yet
    // Using direct form action

    const [amount, setAmount] = useState("1000");
    const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");

    // filter accounts
    const originAccounts = accounts.filter(a => a.currency === (orderType === "BUY" ? "PEN" : "USD"));
    const destinationAccounts = accounts.filter(a => a.currency === (orderType === "BUY" ? "USD" : "PEN"));

    return (
        <Card className="w-full max-w-2xl border-slate-700 bg-slate-900">
            <CardContent className="p-6">
                <form action={createOrder}>
                    <input type="hidden" name="orderType" value={orderType} />

                    <div className="flex bg-slate-950 p-1 rounded-lg mb-6">
                        <button
                            type="button"
                            onClick={() => setOrderType("BUY")}
                            className={`flex-1 py-3 text-sm font-bold rounded-md transition-all ${orderType === "BUY" ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Comprar USD
                        </button>
                        <button
                            type="button"
                            onClick={() => setOrderType("SELL")}
                            className={`flex-1 py-3 text-sm font-bold rounded-md transition-all ${orderType === "SELL" ? "bg-amber-500 text-slate-900" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Vender USD
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">¿Cuánto envías?</label>
                            <div className="relative">
                                <Input
                                    name="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-slate-950 border-slate-700 text-lg font-bold pr-16"
                                />
                                <span className="absolute right-3 top-2 font-bold text-slate-500">
                                    {orderType === "BUY" ? "PEN" : "USD"}
                                </span>
                            </div>
                        </div>

                        {/* Read only estimate could go here */}
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">¿Desde qué cuenta envías? (Origen)</label>
                            {accounts.filter(a => a.currency === (orderType === "BUY" ? "PEN" : "USD")).length > 0 ? (
                                <select name="originAccountId" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:ring-amber-500">
                                    {accounts.filter(a => a.currency === (orderType === "BUY" ? "PEN" : "USD")).map(a => (
                                        <option key={a.id} value={a.id}>{a.bankName} - {a.alias} ({a.accountNumber.slice(-4)})</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="text-red-400 text-sm p-2 border border-red-900/50 bg-red-900/10 rounded">
                                    Necesitas agregar una cuenta en {orderType === "BUY" ? "Soles" : "Dólares"}.
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400">¿Dónde quieres recibir? (Destino)</label>
                            {accounts.filter(a => a.currency === (orderType === "BUY" ? "USD" : "PEN")).length > 0 ? (
                                <select name="destinationAccountId" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:ring-amber-500">
                                    {accounts.filter(a => a.currency === (orderType === "BUY" ? "USD" : "PEN")).map(a => (
                                        <option key={a.id} value={a.id}>{a.bankName} - {a.alias} ({a.accountNumber.slice(-4)})</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="text-red-400 text-sm p-2 border border-red-900/50 bg-red-900/10 rounded">
                                    Necesitas agregar una cuenta en {orderType === "BUY" ? "Dólares" : "Soles"}.
                                </div>
                            )}
                        </div>
                    </div>

                    <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold h-12 text-lg">
                        Crear Orden
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
