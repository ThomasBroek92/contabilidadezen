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
      const { error } = await supabase
        .from("leads")
        .insert({
          nome: data.nome.trim(),
          email: data.email.trim().toLowerCase(),
          whatsapp: data.whatsapp.trim(),
          segmento: data.segmento || "Geral",
          fonte: data.fonte,
          faturamento_mensal: data.faturamento_mensal,
          economia_anual: data.economia_anual,
          consentimento_lgpd: true,
          data_consentimento: new Date().toISOString(),
        });

      if (error) {
        // Don't show error for rate limiting - just silently fail
        if (error.message?.includes("Rate limit")) {
          console.log("Rate limit reached, lead not saved");
          return false;
        }
        console.error("Error saving lead:", error);
        return false;
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
