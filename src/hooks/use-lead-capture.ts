import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeadData {
  nome: string;
  email: string;
  whatsapp: string;
  segmento?: string;
  fonte: string;
  faturamento_mensal?: number;
  economia_anual?: number;
  empresa?: string;
  cargo?: string;
}

export function useLeadCapture() {
  const [isSaving, setIsSaving] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);

  const saveLead = async (data: LeadData): Promise<boolean> => {
    if (!data.nome || !data.email || !data.whatsapp) {
      return false;
    }

    setIsSaving(true);
    
    try {
      const { data: insertedLead, error } = await supabase
        .from("leads")
        .insert({
          nome: data.nome.trim(),
          email: data.email.trim().toLowerCase(),
          whatsapp: data.whatsapp.trim(),
          segmento: data.segmento || "Geral",
          fonte: data.fonte,
          faturamento_mensal: data.faturamento_mensal,
          economia_anual: data.economia_anual,
          empresa: data.empresa,
          cargo: data.cargo,
          consentimento_lgpd: true,
          data_consentimento: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) {
        // Don't show error for rate limiting - just silently fail
        if (error.message?.includes("Rate limit")) {
          console.log("Rate limit reached, lead not saved");
          return false;
        }
        console.error("Error saving lead:", error);
        return false;
      }

      // Create automatic interaction log for Exit Intent leads
      if (insertedLead && data.fonte.toLowerCase().includes('exit intent')) {
        await supabase
          .from("lead_interactions")
          .insert({
            lead_id: insertedLead.id,
            tipo: 'anotacao',
            descricao: `Lead capturado via Exit Intent Pop-up. Fonte: ${data.fonte}. Segmento: ${data.segmento || 'Não informado'}. ${data.empresa ? `Cidade: ${data.empresa}.` : ''} ${data.cargo ? `Atividade: ${data.cargo}.` : ''}`.trim(),
            resultado: 'Lead novo - aguardando primeiro contato',
          });
      }

      setLeadSaved(true);
      return true;
    } catch (error) {
      console.error("Error saving lead:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetLeadState = () => {
    setLeadSaved(false);
  };

  return {
    saveLead,
    isSaving,
    leadSaved,
    resetLeadState,
  };
}
