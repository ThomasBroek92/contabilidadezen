

# SEO Refinement: Anchor Text + External Link Qualification

## 1. Improve Generic Anchor Text ("Saiba mais")

Replace generic "Saiba mais" with descriptive text including the niche/service name.

**`src/components/sections/NichesCarousel.tsx` (line 340)**
- Change from: `Saiba mais`
- Change to: Dynamic text using niche title, e.g., `Contabilidade para {niche.subtitle}` or shorter `Ver {niche.subtitle}`
- Each card will have unique, descriptive anchor text like "Ver Médicos e Profissionais da Saúde", "Ver Advogados", etc.

**`src/components/sections/Services.tsx` (line 128)**
- Change from: `Saiba mais`
- Change to: Dynamic text using service title, e.g., `Saiba mais sobre {service.title}`
- Results: "Saiba mais sobre Contabilidade para Médicos", "Saiba mais sobre Contabilidade para Dentistas", etc.

## 2. Add `rel="nofollow"` to External Google Review Links

Add `nofollow` to all `g.page/r/` links across **19 files**. These are promotional/UGC outbound links that should be qualified per Google guidelines.

**Pattern:** Change `rel="noopener noreferrer"` to `rel="noopener noreferrer nofollow"` on every `<a href="https://g.page/r/...">` element.

**Files affected:**
- `src/components/sections/Testimonials.tsx`
- `src/components/segmentos/medicos/MedicosTestimonials.tsx`
- `src/components/segmentos/dentistas/DentistasTestimonials.tsx`
- `src/components/segmentos/psicologos/PsicologosTestimonials.tsx`
- `src/components/segmentos/advogados/AdvogadosTestimonials.tsx`
- `src/components/segmentos/representantes/RepresentantesTestimonials.tsx`
- `src/components/segmentos/produtores-digitais/ProdutoresDigitaisTestimonials.tsx`
- `src/components/segmentos/profissionais-ti/ProfissionaisTITestimonials.tsx`
- `src/components/segmentos/exportacao-servicos/ExportacaoServicosTestimonials.tsx`
- `src/components/segmentos/prestadores-servico/PrestadoresServicoTestimonials.tsx`
- `src/components/segmentos/profissionais-pj/ProfissionaisPJTestimonials.tsx`
- `src/components/segmentos/ecommerce/EcommerceTestimonials.tsx`
- `src/components/segmentos/clinicas-consultorios/ClinicasConsultoriosTestimonials.tsx`
- `src/components/segmentos/youtubers-creators/YoutubersCreatorsTestimonials.tsx`
- `src/components/segmentos/outros-segmentos/OutrosSegmentosTestimonials.tsx`
- `src/pages/conteudo/CalculadoraPJCLT.tsx`
- `src/pages/conteudo/ModeloContratoPJ.tsx`

**Total: ~19 files, simple find-and-replace of `rel` attribute.**

