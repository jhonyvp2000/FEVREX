import Link from "next/link";
import { Button } from "@fevrex/ui";

import Image from "next/image";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/logo-full.png"
                        alt="Fevrex"
                        width={120}
                        height={40}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                    <Link href="/about" className="hover:text-amber-500 transition-colors">Nosotros</Link>
                    <Link href="/help" className="hover:text-amber-500 transition-colors">Ayuda</Link>
                    <Link href="/business" className="hover:text-amber-500 transition-colors">Empresas</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white hidden sm:block">
                        Iniciar Sesión
                    </Link>
                    <Link href="/register">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                            Regístrate
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
