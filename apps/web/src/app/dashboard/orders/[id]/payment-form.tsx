"use client";

import { useFormState } from "react-dom";
import { Button, Input } from "@fevrex/ui";
import { confirmPayment } from "@/actions/orders";

type State = {
    error?: string;
} | null | undefined;

export function PaymentProofForm({ orderId }: { orderId: string }) {
    const [state, action] = useFormState<State, FormData>(confirmPayment.bind(null, orderId), null);

    return (
        <form action={action} className="space-y-4 pt-4 border-t border-slate-700">
            <div className="space-y-2">
                <label className="font-bold">Ya realicé la transferencia</label>
                <Input
                    name="paymentProofRef"
                    placeholder="Ingresa el Nro de Operación"
                    required
                    className="bg-slate-950 border-slate-700"
                />
                {state?.error && <p className="text-red-400 text-sm">{state.error}</p>}
            </div>
            <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                Confirmar Pago
            </Button>
        </form>
    );
}
