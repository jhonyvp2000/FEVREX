import { db, orders, users } from "@fevrex/db";
import { eq, desc, inArray } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@fevrex/ui"; // Ensure ui package is linked
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const session = await auth();
    if (!session?.user) redirect("/api/auth/signin"); // Should use custom login page but this works

    // Fetch pending review orders
    const pendingOrders = await db.select({
        id: orders.id,
        amountSend: orders.amountSend,
        amountReceive: orders.amountReceive,
        orderType: orders.orderType,
        status: orders.status,
        createdAt: orders.createdAt,
        paymentProofRef: orders.paymentProofRef,
        userEmail: users.email
    })
        .from(orders)
        .innerJoin(users, eq(orders.userId, users.id))
        .where(inArray(orders.status, ["PENDING_PAYMENT_CONFIRMATION", "PAYMENT_CONFIRMED"]))
        .orderBy(desc(orders.createdAt));

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">Fevrex OPS</h1>
                <div className="text-sm text-slate-400">User: {session.user.email}</div>
            </header>

            <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                    <CardTitle>Bandeja de Entrada (Pagos por revisar / Payouts)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-200 uppercase bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Usuario</th>
                                    <th className="px-6 py-3">Tipo</th>
                                    <th className="px-6 py-3">Envía</th>
                                    <th className="px-6 py-3">Recibe</th>
                                    <th className="px-6 py-3">OP #</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingOrders.map(order => (
                                    <tr key={order.id} className="bg-slate-900 border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-mono">{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4">{order.userEmail}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${order.orderType === "BUY" ? "bg-green-900 text-green-400" : "bg-purple-900 text-purple-400"}`}>
                                                {order.orderType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold">{order.amountSend}</td>
                                        <td className="px-6 py-4 font-bold">{order.amountReceive}</td>
                                        <td className="px-6 py-4 font-mono text-white">{order.paymentProofRef || "-"}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-amber-900/50 text-amber-400 px-2 py-1 rounded text-xs">
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/dashboard/orders/${order.id}`}>
                                                <Button size="sm" variant="outline">Ver</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {pendingOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center">No hay órdenes pendientes.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
