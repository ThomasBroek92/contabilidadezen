import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { nome, email, whatsapp, segmento, fonte, faturamento_mensal, economia_anual, empresa, cargo, observacoes } = await req.json();

    const whatsappLink = `https://wa.me/55${whatsapp.replace(/\D/g, "")}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">🎯 Novo Lead Capturado!</h1>
          <p style="color: #ccfbf1; margin: 8px 0 0;">Contabilidade Zen</p>
        </div>
        
        <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 24px; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151; width: 140px;">Nome</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${nome}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">E-mail</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;"><a href="mailto:${email}" style="color: #0d9488;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">WhatsApp</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;"><a href="${whatsappLink}" style="color: #25D366; font-weight: bold;">${whatsapp}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">Segmento</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${segmento || "Não informado"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">Fonte</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${fonte}</td>
            </tr>
            ${empresa ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">Empresa</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${empresa}</td></tr>` : ""}
            ${cargo ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">Cargo</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${cargo}</td></tr>` : ""}
            ${faturamento_mensal ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">Faturamento</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">R$ ${Number(faturamento_mensal).toLocaleString("pt-BR")}/mês</td></tr>` : ""}
            ${economia_anual ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">Economia</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">R$ ${Number(economia_anual).toLocaleString("pt-BR")}/ano</td></tr>` : ""}
            ${observacoes ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #374151;">Observações</td><td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${observacoes}</td></tr>` : ""}
          </table>
          
          <div style="margin-top: 24px; text-align: center;">
            <a href="${whatsappLink}" style="display: inline-block; background: #25D366; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              💬 Responder no WhatsApp
            </a>
          </div>
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
            E-mail automático · Contabilidade Zen · ${new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Contabilidade Zen <onboarding@resend.dev>",
        to: ["thomasbroek1992@gmail.com"],
        subject: `🎯 Novo Lead: ${nome} — ${segmento || "Geral"}`,
        html: htmlContent,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend API error:", resendData);
      throw new Error(`Resend error [${resendRes.status}]: ${JSON.stringify(resendData)}`);
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending lead notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
