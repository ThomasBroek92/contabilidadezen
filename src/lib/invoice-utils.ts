import { CURRENCIES, type CurrencyCode } from "@/components/gerador-invoice/constants";

// Formatação de moeda
export function formatCurrency(value: number, currencyCode: CurrencyCode): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) return value.toFixed(2);
  
  // Para moedas brasileiras e europeias, usa vírgula como separador decimal
  const useComma = ["BRL", "EUR", "ARS", "CLP", "COP", "PEN", "UYU"].includes(currencyCode);
  
  const formatted = value.toLocaleString(useComma ? "pt-BR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${currency.symbol} ${formatted}`;
}

// Máscara para CNPJ
export function maskCnpj(value: string): string {
  const numbers = value.replace(/\D/g, "").slice(0, 14);
  
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`;
}

// Máscara para CPF
export function maskCpf(value: string): string {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
}

// Máscara inteligente para CPF ou CNPJ
export function maskCpfCnpj(value: string): string {
  const numbers = value.replace(/\D/g, "");
  
  if (numbers.length <= 11) {
    return maskCpf(numbers);
  }
  return maskCnpj(numbers);
}

// Máscara para telefone (aceita fixo e celular)
export function maskPhone(value: string): string {
  const numbers = value.replace(/\D/g, "").slice(0, 11);
  
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
}

// Validação de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validação de CNPJ (formato)
export function isValidCnpjFormat(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, "");
  return numbers.length === 14;
}

// Validação de CPF (formato)
export function isValidCpfFormat(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, "");
  return numbers.length === 11;
}

// Validação de SWIFT (8 ou 11 caracteres alfanuméricos)
export function isValidSwift(swift: string): boolean {
  if (!swift) return true; // Opcional
  const swiftRegex = /^[A-Z0-9]{8}$|^[A-Z0-9]{11}$/i;
  return swiftRegex.test(swift);
}

// Validação de IBAN (max 34 caracteres alfanuméricos)
export function isValidIban(iban: string): boolean {
  if (!iban) return true; // Opcional
  const ibanRegex = /^[A-Z0-9]{1,34}$/i;
  return ibanRegex.test(iban.replace(/\s/g, ""));
}

// Formatar data para exibição (DD/MM/AAAA)
export function formatDateBR(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

// Converter valor string para número
export function parseAmount(value: string): number {
  if (!value) return 0;
  // Remove tudo exceto números, vírgula e ponto
  const cleaned = value.replace(/[^\d,.]/g, "");
  // Substitui vírgula por ponto
  const normalized = cleaned.replace(",", ".");
  return parseFloat(normalized) || 0;
}

// Gerar slug para nome do arquivo
export function generateFileSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9]+/g, "-") // Substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, "") // Remove hífens do início e fim
    .slice(0, 50); // Limita a 50 caracteres
}

// Gerar nome do arquivo PDF
export function generatePdfFilename(invoiceCode: string, clientName: string, docType: "invoice" | "fatura"): string {
  const codeSlug = invoiceCode ? generateFileSlug(invoiceCode) : formatDateBR(new Date().toISOString().split("T")[0]).replace(/\//g, "-");
  const clientSlug = generateFileSlug(clientName) || "documento";
  return `${docType}-${codeSlug}-${clientSlug}.pdf`;
}
