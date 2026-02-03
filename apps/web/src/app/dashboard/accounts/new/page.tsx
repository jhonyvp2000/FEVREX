"use client";

import { useFormState } from "react-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from "@fevrex/ui";
import { addBankAccount } from "@/actions/accounts";


type State = {
    error?: {
        alias?: string[];
        bankName?: string[];
        currency?: string[];
        accountNumber?: string[];
        cci?: string[];
        form?: string[];
    };
} | null;

export default function NewAccountPage() {
    const [state, action] = useFormState<State, FormData>(addBankAccount, null);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <Card className="w-full max-w-lg border-slate-700 bg-slate-900">
                    <CardHeader>
                        <CardTitle>Agregar Nueva Cuenta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alias (Ej. BCP Ahorros)</label>
                                <Input name="alias" required className="bg-slate-950 border-slate-700" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Banco</label>
                                    <select name="bankName" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
                                        <option value="BCP">BCP</option>
                                        <option value="INTERBANK">Interbank</option>
                                        <option value="BBVA">BBVA</option>
                                        <option value="SCOTIABANK">Scotiabank</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Moneda</label>
                                    <select name="currency" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white">
                                        <option value="PEN">Soles (PEN)</option>
                                        <option value="USD">Dólares (USD)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Número de Cuenta</label>
                                <Input name="accountNumber" required className="bg-slate-950 border-slate-700" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">CCI (Opcional)</label>
                                <Input name="cci" className="bg-slate-950 border-slate-700" />
                            </div>

                            {state?.error?.form && <p className="text-red-400 text-sm">{state.error.form}</p>}

                            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold mt-4">
                                Guardar Cuenta
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
