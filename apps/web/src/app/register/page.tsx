"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from "@fevrex/ui";
import { registerAction } from "@/actions/auth";
import { Navbar } from "@/components/layout/Navbar";


type State = {
    error?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        form?: string[];
    };
    success?: boolean;
} | null;

export default function RegisterPage() {
    const [state, action] = useFormState<State, FormData>(registerAction, null);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-slate-700 bg-slate-900 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl text-amber-500">Crear Cuenta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {state?.success ? (
                            <div className="text-center space-y-4">
                                <p className="text-green-400">¡Cuenta creada con éxito!</p>
                                <Link href="/login">
                                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">Iniciar Sesión</Button>
                                </Link>
                            </div>
                        ) : (
                            <form action={action} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input name="email" type="email" required className="bg-slate-950 border-slate-700" placeholder="nombre@empresa.com" />
                                    {state?.error?.email && <p className="text-red-400 text-xs">{state.error.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contraseña</label>
                                    <Input name="password" type="password" required className="bg-slate-950 border-slate-700" placeholder="••••••••" />
                                    {state?.error?.password && <p className="text-red-400 text-xs">{state.error.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Confirmar Contraseña</label>
                                    <Input name="confirmPassword" type="password" required className="bg-slate-950 border-slate-700" placeholder="••••••••" />
                                    {state?.error?.confirmPassword && <p className="text-red-400 text-xs">{state.error.confirmPassword}</p>}
                                </div>

                                <div className="space-y-4 pt-2">
                                    <label className="text-sm font-medium block">Tipo de Cuenta</label>
                                    <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-md">
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById("accountTypeInput")?.setAttribute("value", "PERSONAL")}
                                            className="py-2 text-sm font-medium rounded transition-colors bg-slate-800 text-white hover:bg-slate-700 focus:bg-amber-500 focus:text-black"
                                        >
                                            Persona
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById("accountTypeInput")?.setAttribute("value", "COMPANY")}
                                            className="py-2 text-sm font-medium rounded transition-colors bg-slate-800 text-white hover:bg-slate-700 focus:bg-amber-500 focus:text-black"
                                        >
                                            Empresa
                                        </button>
                                    </div>
                                    <input type="hidden" name="accountType" id="accountTypeInput" defaultValue="PERSONAL" />
                                </div>

                                {state?.error?.form && <p className="text-red-400 text-sm">{state.error.form}</p>}

                                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                                    Registrarse
                                </Button>
                            </form>
                        )}
                        <div className="mt-4 text-center text-sm text-slate-400">
                            ¿Ya tienes cuenta? <Link href="/login" className="text-amber-500 hover:underline">Inicia Sesión</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
}
