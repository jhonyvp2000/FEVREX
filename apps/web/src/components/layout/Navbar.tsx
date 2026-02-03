import Link from "next/link";
import { Button } from "@fevrex/ui";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
                        FEVREX
                    </span>
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
