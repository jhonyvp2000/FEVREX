"use client";

import { useFormState } from "react-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from "@fevrex/ui";
import { submitKYC } from "@/actions/kyc";


type State = {
    error?: {
        firstName?: string[];
        lastName?: string[];
        documentNumber?: string[];
        phone?: string[];
        form?: string[];
    };
} | null;

export default function KYCPage() {
    const [state, action] = useFormState<State, FormData>(submitKYC, null);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-6">Verificación de Identidad</h1>
                <Card className="w-full max-w-2xl border-slate-700 bg-slate-900">
                    <CardHeader>
                        <CardTitle>Datos Personales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nombres</label>
                                    <Input name="firstName" required className="bg-slate-950 border-slate-700" />
                                    {state?.error?.firstName && <p className="text-red-400 text-xs">{state.error.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Apellidos</label>
                                    <Input name="lastName" required className="bg-slate-950 border-slate-700" />
                                    {state?.error?.lastName && <p className="text-red-400 text-xs">{state.error.lastName}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipo Doc</label>
                                    <select name="documentType" className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                        <option value="DNI">DNI</option>
                                        <option value="CE">CE</option>
                                        <option value="PASSPORT">Pasaporte</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nro Documento</label>
                                    <Input name="documentNumber" required className="bg-slate-950 border-slate-700" />
                                    {state?.error?.documentNumber && <p className="text-red-400 text-xs">{state.error.documentNumber}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Celular</label>
                                <Input name="phone" required className="bg-slate-950 border-slate-700" />
                                {state?.error?.phone && <p className="text-red-400 text-xs">{state.error.phone}</p>}
                            </div>

                            {state?.error?.form && <p className="text-red-400 text-sm">{state.error.form}</p>}

                            <div className="pt-4">
                                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                                    Enviar Verificación
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
