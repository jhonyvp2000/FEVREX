import { auth } from "@/auth";
import { db, bankAccounts } from "@fevrex/db";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/layout/Navbar";
import { NewOrderForm } from "@/components/orders/NewOrderForm"; // Client Component

// Fetch data server side
export default async function NewOrderPage() {
    const session = await auth();
    const accounts = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, session?.user?.id!));

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Nueva Operación</h1>
                <div className="flex justify-center">
                    <NewOrderForm accounts={accounts} />
                </div>
            </div>
        </div>
    );
}
