import { auth } from "@/auth";
import { db, orders, bankAccounts } from "@fevrex/db";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, Input, Button } from "@fevrex/ui";
import { confirmPayment } from "@/actions/orders";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const session = await auth();
    const [order] = await db.select().from(orders).where(eq(orders.id, params.id)).limit(1);

    if (!order || order.userId !== session?.user?.id) notFound();

    // Ideally join accounts to get details. For now strict fetch or assumption
    // Quick join mockup
    // const originAccount = accounts.find...

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex justify-center">
                <Card className="w-full max-w-2xl border-slate-700 bg-slate-900">
                    <CardHeader>
                        <CardTitle className="flex justify-between">
                            <span>Orden #{order.id.slice(0, 8)}</span>
                            <span className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm">{order.status}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded">
                            <div>
                                <p className="text-xs text-slate-400">Envías</p>
                                <p className="text-xl font-bold">{order.amountSend} {order.orderType === "BUY" ? "PEN" : "USD"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400">Recibes (est)</p>
                                <p className="text-xl font-bold text-amber-500">{order.amountReceive} {order.orderType === "BUY" ? "USD" : "PEN"}</p>
                            </div>
                            <div className="col-span-2 border-t border-slate-800 pt-2 mt-2 flex justify-between">
                                <span className="text-sm text-slate-400">Tipo de Cambio</span>
                                <span className="font-mono">{order.exchangeRate}</span>
                            </div>
                        </div>

                        {order.status === "CREATED" && (
                            <div className="space-y-4">
                                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded">
                                    <h4 className="font-bold text-blue-400 mb-2">Instrucciones de Transferencia</h4>
                                    <p className="text-sm mb-2">Transfiere el monto exacto a nuestra cuenta:</p>
                                    <p className="font-mono bg-slate-950 p-2 rounded text-center text-lg select-all">
                                        {order.orderType === "BUY" ? "BCP PEN: 193-0000000-0-99" : "BCP USD: 193-1111111-1-99"}
                                    </p>
                                    <p className="text-center text-xs text-slate-400 mt-1">Titular: FEVREX SAC - RUC: 20600000000</p>
                                </div>

                                <form action={confirmPayment.bind(null, order.id)} className="space-y-4 pt-4 border-t border-slate-700">
                                    <div className="space-y-2">
                                        <label className="font-bold">Ya realicé la transferencia</label>
                                        <Input name="paymentProofRef" placeholder="Ingresa el Nro de Operación" required className="bg-slate-950 border-slate-700" />
                                    </div>
                                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                                        Confirmar Pago
                                    </Button>
                                </form>
                            </div>
                        )}

                        {order.status === "PENDING_PAYMENT_CONFIRMATION" && (
                            <div className="text-center py-8">
                                <div className="animate-pulse text-amber-500 font-bold text-xl mb-2">Validando Pago...</div>
                                <p className="text-slate-400">Estamos verificando tu transferencia. Esto toma aprox 10-15 min.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
