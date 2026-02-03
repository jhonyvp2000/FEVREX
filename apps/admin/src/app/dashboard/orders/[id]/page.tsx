import { db, orders, bankAccounts, users } from "@fevrex/db";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@fevrex/ui";
import { adminConfirmReceived, adminMarkCompleted } from "@/actions/admin-ops";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
    const [order] = await db.select().from(orders).where(eq(orders.id, params.id)).limit(1);
    if (!order) notFound();

    const [user] = await db.select().from(users).where(eq(users.id, order.userId)).limit(1);
    const [destinationAccount] = order.destinationAccountId ? await db.select().from(bankAccounts).where(eq(bankAccounts.id, order.destinationAccountId)).limit(1) : [null];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex justify-center">
            <Card className="w-full max-w-3xl bg-slate-900 border-slate-700">
                <CardHeader>
                    <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white flex items-center gap-2 mb-4">
                        <ArrowLeft size={16} /> Volver
                    </Link>
                    <CardTitle>Orden #{order.id} - {user?.email}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-slate-500 text-sm uppercase font-bold mb-2">Detalles Operación</h3>
                            <div className="bg-slate-950 p-4 rounded space-y-2">
                                <p><span className="text-slate-500">Tipo:</span> {order.orderType}</p>
                                <p><span className="text-slate-500">Envía:</span> {order.amountSend}</p>
                                <p><span className="text-slate-500">Recibe:</span> {order.amountReceive}</p>
                                <p><span className="text-slate-500">Tasa:</span> {order.exchangeRate}</p>
                                <p><span className="text-slate-500">Estado:</span> <span className="text-amber-500">{order.status}</span></p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-slate-500 text-sm uppercase font-bold mb-2">Validación Pago (Entrante)</h3>
                            <div className="bg-slate-950 p-4 rounded space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500">Nro Operación Reportado:</p>
                                    <p className="font-mono text-xl font-bold">{order.paymentProofRef || "PENDIENTE"}</p>
                                </div>

                                {order.status === "PENDING_PAYMENT_CONFIRMATION" && (
                                    <form action={adminConfirmReceived.bind(null, order.id)}>
                                        <Button className="w-full bg-green-600 hover:bg-green-700">Confirmar Recepción</Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-slate-500 text-sm uppercase font-bold mb-2">Cuenta Destino (Payout)</h3>
                        <div className="bg-slate-950 p-4 rounded">
                            {destinationAccount ? (
                                <>
                                    <p className="font-bold">{destinationAccount.bankName} - {destinationAccount.currency}</p>
                                    <p className="font-mono text-lg select-all">{destinationAccount.accountNumber}</p>
                                    <p className="text-sm text-slate-400">{destinationAccount.alias} - {user?.email}</p>
                                </>
                            ) : (
                                <p className="text-red-400">No destination account found (?)</p>
                            )}
                        </div>
                    </div>

                    {(order.status === "PAYMENT_CONFIRMED" || order.status === "PAYOUT_IN_PROGRESS") && (
                        <div className="border-t border-slate-700 pt-6">
                            <h3 className="text-slate-500 text-sm uppercase font-bold mb-2">Acciones Salientes</h3>
                            <p className="text-sm text-slate-300 mb-4">Realiza la transferencia manual a la cuenta de arriba y confirma.</p>
                            <form action={adminMarkCompleted.bind(null, order.id)}>
                                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                                    Marcar como COMPLETADO
                                </Button>
                            </form>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
