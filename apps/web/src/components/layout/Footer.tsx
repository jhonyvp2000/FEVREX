export function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400 text-sm">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-amber-500 font-bold text-lg mb-4">FEVREX</h3>
                    <p>La plataforma de cambio de divisas más confiable del Perú. Operaciones seguras, rápidas y al mejor precio.</p>
                </div>
                <div>
                    <h4 className="font-bold text-slate-200 mb-4">Legal</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-amber-500">Términos y Condiciones</a></li>
                        <li><a href="#" className="hover:text-amber-500">Política de Privacidad</a></li>
                        <li><a href="#" className="hover:text-amber-500">Libro de Reclamaciones</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-200 mb-4">Contacto</h4>
                    <ul className="space-y-2">
                        <li>soporte@fevrex.com</li>
                        <li>+51 999 999 999</li>
                        <li>Lima, Perú</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-200 mb-4">Regulación</h4>
                    <div className="border border-slate-700 p-4 rounded bg-slate-900 text-xs">
                        Registrados en la SBS. Resolución No. XXXXX-202X.
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center">
                &copy; {new Date().getFullYear()} Fevrex SAC. Todos los derechos reservados.
            </div>
        </footer>
    );
}
