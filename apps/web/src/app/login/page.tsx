"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from "@fevrex/ui";
import { loginAction } from "@/actions/auth";
import { Navbar } from "@/components/layout/Navbar";



type State = {
    error?: string;
} | null | undefined;

export default function LoginPage() {
    const [state, action] = useFormState<State, FormData>(loginAction, null);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-slate-700 bg-slate-900 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl text-amber-500">Iniciar Sesión</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input name="email" type="email" required className="bg-slate-950 border-slate-700" placeholder="nombre@empresa.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contraseña</label>
                                <Input name="password" type="password" required className="bg-slate-950 border-slate-700" placeholder="••••••••" />
                            </div>

                            {state?.error && <p className="text-red-400 text-sm text-center">{state.error}</p>}

                            <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                                Ingresar
                            </Button>
                        </form>

                        <div className="mt-4 text-center text-sm text-slate-400">
                            ¿No tienes cuenta? <Link href="/register" className="text-amber-500 hover:underline">Regístrate</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
