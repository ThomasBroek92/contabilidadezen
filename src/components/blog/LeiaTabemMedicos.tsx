import { Link } from "react-router-dom";
import { BookOpen, Calculator, Stethoscope } from "lucide-react";

/**
 * "Leia também" block injected into blog posts in the "médicos" category.
 * Boosts internal authority by linking to pillar + segment + tool pages.
 */
export function LeiaTambemMedicos() {
  return (
    <aside className="my-10 rounded-xl border border-primary/20 bg-primary/5 p-6" aria-label="Leia também">
      <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        Leia também
      </h3>
      <ul className="space-y-3">
        <li>
          <Link
            to="/guia-contabilidade-medicos"
            className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <BookOpen className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="group-hover:underline">
              Guia Completo de Contabilidade para Médicos PJ 2026
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/conteudo/calculadora-pj-clt"
            className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <Calculator className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="group-hover:underline">
              Calculadora PJ x CLT 2026 — Simule sua economia
            </span>
          </Link>
        </li>
        <li>
          <Link
            to="/segmentos/contabilidade-para-medicos"
            className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <Stethoscope className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="group-hover:underline">
              Contabilidade Especializada para Médicos — Conheça nossos planos
            </span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
