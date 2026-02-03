import { INVOICE_THEMES, CURRENCIES, INVOICE_TRANSLATIONS, type InvoiceFormData } from "./constants";
import { formatCurrency, formatDateBR, parseAmount } from "@/lib/invoice-utils";

interface InvoicePreviewProps {
  data: InvoiceFormData;
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const theme = INVOICE_THEMES.find(t => t.id === data.theme) || INVOICE_THEMES[0];
  const currency = CURRENCIES.find(c => c.code === data.currency);
  const amount = parseAmount(data.amount);
  const t = INVOICE_TRANSLATIONS[data.language];
  
  const docTypeLabel = data.documentType === "invoice" ? t.invoice : t.fatura;
  
  return (
    <div className="bg-white border border-border rounded-lg shadow-sm overflow-hidden">
      {/* Header com cor do tema */}
      <div 
        className="px-6 py-4 text-white"
        style={{ backgroundColor: theme.color }}
      >
        <h2 className="text-2xl font-bold tracking-wide">{docTypeLabel}</h2>
        {data.invoiceCode && (
          <p className="text-sm opacity-90">{t.number} {data.invoiceCode}</p>
        )}
      </div>
      
      {/* Conteúdo */}
      <div className="p-6 space-y-6 text-sm">
        {/* Dados do prestador */}
        <div>
          <p className="font-semibold text-foreground">
            {data.providerName || "Nome do Prestador"}
          </p>
          {data.providerCnpj && (
            <p className="text-muted-foreground">{t.cnpj}: {data.providerCnpj}</p>
          )}
          {data.providerAddress && (
            <p className="text-muted-foreground">{data.providerAddress}</p>
          )}
          {data.providerPhone && (
            <p className="text-muted-foreground">{t.phone} {data.providerPhone}</p>
          )}
          {data.providerEmail && (
            <p className="text-muted-foreground">{data.providerEmail}</p>
          )}
        </div>
        
        {/* Dados do cliente */}
        <div className="border-t border-border pt-4">
          <p 
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: theme.color }}
          >
            {t.billedTo}
          </p>
          <p className="font-medium text-foreground">
            {data.clientName || "Nome do Cliente"}
          </p>
          {data.clientDocument && (
            <p className="text-muted-foreground">
              {data.clientDocument.replace(/\D/g, "").length <= 11 ? t.cpf : t.cnpj}: {data.clientDocument}
            </p>
          )}
        </div>
        
        {/* Datas */}
        <div className="flex gap-8 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase">{t.issueDate}</p>
            <p className="font-medium">{formatDateBR(data.issueDate) || "--/--/----"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase">{t.dueDate}</p>
            <p className="font-medium">{formatDateBR(data.dueDate) || "--/--/----"}</p>
          </div>
        </div>
        
        {/* Serviço */}
        <div className="border-t border-border pt-4">
          <p 
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: theme.color }}
          >
            {t.service}
          </p>
          <p className="font-medium text-foreground">
            {data.serviceTitle || "Título do Serviço"}
          </p>
        </div>
        
        {/* Descrição */}
        {(data.serviceDescription || !data.serviceTitle) && (
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">{t.description}</p>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {data.serviceDescription || "Descreva os serviços prestados..."}
            </p>
          </div>
        )}
        
        {/* Valor */}
        <div 
          className="rounded-lg p-4 text-center"
          style={{ backgroundColor: `${theme.color}10` }}
        >
          <p className="text-xs text-muted-foreground uppercase mb-1">{t.amountDue}</p>
          <p 
            className="text-2xl font-bold"
            style={{ color: theme.color }}
          >
            {amount > 0 
              ? formatCurrency(amount, data.currency)
              : `${currency?.symbol || "R$"} 0,00`
            }
          </p>
        </div>
        
        {/* Dados bancários (se invoice e preenchido) */}
        {data.documentType === "invoice" && (data.swiftCode || data.ibanCode) && (
          <div className="border-t border-border pt-4">
            <p 
              className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: theme.color }}
            >
              {t.bankDetails}
            </p>
            {data.swiftCode && (
              <p className="text-muted-foreground">
                <span className="font-medium">{t.swiftBic}</span> {data.swiftCode}
              </p>
            )}
            {data.ibanCode && (
              <p className="text-muted-foreground">
                <span className="font-medium">{t.iban}</span> {data.ibanCode}
              </p>
            )}
          </div>
        )}
        
        {/* Rodapé */}
        <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <p>{t.generatedBy}</p>
          <p className="font-semibold" style={{ color: theme.color }}>
            Contabilidade Zen
          </p>
          <p>contabilidadezen.com.br</p>
        </div>
      </div>
    </div>
  );
}

