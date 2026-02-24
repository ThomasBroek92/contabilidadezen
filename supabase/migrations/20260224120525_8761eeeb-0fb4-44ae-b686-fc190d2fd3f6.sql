
CREATE OR REPLACE FUNCTION public.auto_log_exit_intent_interaction()
  RETURNS TRIGGER AS $$
BEGIN
  IF LOWER(NEW.fonte) LIKE '%exit intent%' THEN
    INSERT INTO public.lead_interactions (lead_id, tipo, descricao, resultado)
    VALUES (
      NEW.id,
      'anotacao',
      'Lead capturado via Exit Intent Pop-up. Fonte: ' || NEW.fonte ||
        '. Segmento: ' || COALESCE(NEW.segmento, 'Nao informado') ||
        CASE WHEN NEW.empresa IS NOT NULL THEN '. Cidade: ' || NEW.empresa ELSE '' END ||
        CASE WHEN NEW.cargo IS NOT NULL THEN '. Atividade: ' || NEW.cargo ELSE '' END,
      'Lead novo - aguardando primeiro contato'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER auto_exit_intent_interaction
  AFTER INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_log_exit_intent_interaction();
