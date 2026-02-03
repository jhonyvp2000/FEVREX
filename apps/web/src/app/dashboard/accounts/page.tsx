import { auth } from "@/auth";
import { db, bankAccounts } from "@fevrex/db";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@fevrex/ui";
import Link from "next/link";
import { Plus, Trash2, Building } from "lucide-react";
import { deleteBankAccount } from "@/actions/accounts";

// Helper component for delete button to use server action
function DeleteButton({ id }: { id: string }) {
    // We need a client component or just bind the action. 
    // For simplicity in RSC: usage of form
    return (
        <form action={deleteBankAccount.bind(null, id)}>
            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-950">
                <Trash2 className="h-4 w-4" />
            </Button>
        </form>
    )
}

export default async function AccountsPage() {
    const session = await auth();
    if (!session?.user?.id) return <div />;

    const accounts = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, session.user.id));

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Mis Cuentas Bancarias</h1>
                    <Link href="/dashboard/accounts/new">
                        <Button className="bg-amber-500 text-slate-900 font-bold"><Plus className="mr-2 h-4 w-4" /> Agregar Cuenta</Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((acc) => (
                        <Card key={acc.id} className="bg-slate-900 border-slate-700">
                            <CardHeader className="flex flex-row justify-between items-start pb-2">
                                <CardTitle className="text-lg font-medium text-slate-200 flex items-center gap-2">
                                    <Building className="text-slate-500 h-5 w-5" /> {acc.bankName}
                                </CardTitle>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${acc.currency === "USD" ? "bg-green-900 text-green-400" : "bg-purple-900 text-purple-400"}`}>
                                    {acc.currency}
                                </span>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-400 mb-1">{acc.alias}</p>
                                <p className="font-mono text-lg">{acc.accountNumber}</p>
                                {acc.cci && <p className="font-mono text-xs text-slate-500 mt-1">CCI: {acc.cci}</p>}

                                <div className="flex justify-end mt-4">
                                    <DeleteButton id={acc.id} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {accounts.length === 0 && (
                        <div className="col-span-full text-center py-12 border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
                            No tienes cuentas registradas. Agrega una para empezar a operar.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
