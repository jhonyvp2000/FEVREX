import { auth } from "@/auth";
import { getUserProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@fevrex/ui";
import Link from "next/link";
import { ShieldAlert, CheckCircle, Clock } from "lucide-react";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const profile = await getUserProfile(session.user.id);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Hola, {profile?.firstName || session.user.email}</h1>

                {/* KYC Status Banner */}
                {profile?.kycStatus === "PENDING" && (
                    <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="text-amber-500 h-6 w-6" />
                            <div>
                                <h3 className="font-bold text-amber-500">Verificación Requerida</h3>
                                <p className="text-sm text-slate-300">Completa tu perfil para empezar a operar.</p>
                            </div>
                        </div>
                        <Link href="/kyc">
                            <Button>Verificar Ahora</Button>
                        </Link>
                    </div>
                )}

                {profile?.kycStatus === "IN_REVIEW" && (
                    <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 flex items-center gap-3 mb-8">
                        <Clock className="text-blue-500 h-6 w-6" />
                        <div>
                            <h3 className="font-bold text-blue-500">En Revisión</h3>
                            <p className="text-sm text-slate-300">Estamos validando tus datos. Te avisaremos pronto.</p>
                        </div>
                    </div>
                )}

                {profile?.kycStatus === "VERIFIED" && (
                    <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center gap-3 mb-8">
                        <CheckCircle className="text-green-500 h-6 w-6" />
                        <div>
                            <h3 className="font-bold text-green-500">Cuenta Verificada</h3>
                            <p className="text-sm text-slate-300">Puedes realizar operaciones sin límites.</p>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-slate-900 border-slate-700">
                        <CardHeader><CardTitle>Mis Operaciones</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-slate-500">No hay operaciones recientes.</div>
                            {profile?.kycStatus === "VERIFIED" && (
                                <Link href="/">
                                    <Button className="w-full mt-4">Nueva Operación</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 border-slate-700">
                        <CardHeader><CardTitle>Mis Cuentas</CardTitle></CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-slate-500">No tienes cuentas registradas.</div>
                            <Button variant="outline" className="w-full mt-4">Agregar Cuenta</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
