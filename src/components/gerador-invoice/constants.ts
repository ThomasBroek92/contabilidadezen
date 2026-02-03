// Lista completa de 29 moedas suportadas
export const CURRENCIES = [
  { code: "BRL", name: "Real Brasileiro", symbol: "R$" },
  { code: "USD", name: "Dólar Americano", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "Libra Esterlina", symbol: "£" },
  { code: "JPY", name: "Iene Japonês", symbol: "¥" },
  { code: "CNY", name: "Yuan Chinês", symbol: "¥" },
  { code: "CHF", name: "Franco Suíço", symbol: "CHF" },
  { code: "CAD", name: "Dólar Canadense", symbol: "C$" },
  { code: "AUD", name: "Dólar Australiano", symbol: "A$" },
  { code: "NZD", name: "Dólar Neozelandês", symbol: "NZ$" },
  { code: "INR", name: "Rupia Indiana", symbol: "₹" },
  { code: "KRW", name: "Won Sul-coreano", symbol: "₩" },
  { code: "MXN", name: "Peso Mexicano", symbol: "MX$" },
  { code: "ARS", name: "Peso Argentino", symbol: "AR$" },
  { code: "CLP", name: "Peso Chileno", symbol: "CLP" },
  { code: "COP", name: "Peso Colombiano", symbol: "COP" },
  { code: "PEN", name: "Sol Peruano", symbol: "S/" },
  { code: "UYU", name: "Peso Uruguaio", symbol: "UYU" },
  { code: "ZAR", name: "Rand Sul-africano", symbol: "R" },
  { code: "RUB", name: "Rublo Russo", symbol: "₽" },
  { code: "TRY", name: "Lira Turca", symbol: "₺" },
  { code: "SEK", name: "Coroa Sueca", symbol: "kr" },
  { code: "NOK", name: "Coroa Norueguesa", symbol: "kr" },
  { code: "DKK", name: "Coroa Dinamarquesa", symbol: "kr" },
  { code: "PLN", name: "Zloty Polonês", symbol: "zł" },
  { code: "SGD", name: "Dólar de Singapura", symbol: "S$" },
  { code: "HKD", name: "Dólar de Hong Kong", symbol: "HK$" },
  { code: "THB", name: "Baht Tailandês", symbol: "฿" },
  { code: "MYR", name: "Ringgit Malaio", symbol: "RM" },
] as const;

// Temas de cores disponíveis
export const INVOICE_THEMES = [
  { id: "green", name: "Verde Zen", color: "#10B981" },
  { id: "blue", name: "Azul", color: "#3B82F6" },
  { id: "red", name: "Vermelho", color: "#EF4444" },
  { id: "yellow", name: "Amarelo", color: "#F59E0B" },
  { id: "gray", name: "Cinza", color: "#6B7280" },
  { id: "default", name: "Padrão", color: "#1F3A55" },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]["code"];
export type ThemeId = typeof INVOICE_THEMES[number]["id"];

// Interface para os dados do formulário
export interface InvoiceFormData {
  // Tipo do documento
  documentType: "invoice" | "fatura";
  
  // Dados do prestador
  invoiceCode: string;
  providerName: string;
  providerCnpj: string;
  providerAddress: string;
  providerPhone: string;
  providerEmail: string;
  
  // Dados do cliente
  clientName: string;
  clientDocument: string;
  
  // Detalhes financeiros
  currency: CurrencyCode;
  amount: string;
  issueDate: string;
  dueDate: string;
  serviceTitle: string;
  serviceDescription: string;
  
  // Dados bancários internacionais (opcional)
  swiftCode: string;
  ibanCode: string;
  
  // Tema visual
  theme: ThemeId;
  
  // Marketing
  acceptMarketing: boolean;
}

// Valores iniciais do formulário
export const INITIAL_FORM_DATA: InvoiceFormData = {
  documentType: "invoice",
  invoiceCode: "",
  providerName: "",
  providerCnpj: "",
  providerAddress: "",
  providerPhone: "",
  providerEmail: "",
  clientName: "",
  clientDocument: "",
  currency: "BRL",
  amount: "",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  serviceTitle: "",
  serviceDescription: "",
  swiftCode: "",
  ibanCode: "",
  theme: "green",
  acceptMarketing: false,
};
