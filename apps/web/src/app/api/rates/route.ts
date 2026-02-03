import { NextResponse } from "next/server";
import { MockRateProvider } from "@fevrex/lib";

// Ideally singleton or per request
const rateProvider = new MockRateProvider();

export const dynamic = "force-dynamic";

export async function GET() {
    const rates = await rateProvider.getRates();
    return NextResponse.json(rates);
}
