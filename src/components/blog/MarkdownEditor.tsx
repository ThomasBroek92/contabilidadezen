import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Link, Image, Code, Quote
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('write');

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);

    // Focus and set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Negrito', before: '**', after: '**', placeholder: 'texto em negrito' },
    { icon: Italic, label: 'Itálico', before: '_', after: '_', placeholder: 'texto em itálico' },
    { icon: Heading1, label: 'Título 1', before: '# ', after: '', placeholder: 'Título' },
    { icon: Heading2, label: 'Título 2', before: '## ', after: '', placeholder: 'Subtítulo' },
    { icon: Heading3, label: 'Título 3', before: '### ', after: '', placeholder: 'Subtítulo menor' },
    { icon: List, label: 'Lista', before: '- ', after: '', placeholder: 'Item da lista' },
    { icon: ListOrdered, label: 'Lista numerada', before: '1. ', after: '', placeholder: 'Item numerado' },
    { icon: Link, label: 'Link', before: '[', after: '](url)', placeholder: 'texto do link' },
    { icon: Image, label: 'Imagem', before: '![', after: '](url)', placeholder: 'descrição da imagem' },
    { icon: Code, label: 'Código', before: '`', after: '`', placeholder: 'código' },
    { icon: Quote, label: 'Citação', before: '> ', after: '', placeholder: 'citação' },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between bg-muted/30 px-2 py-1 border-b border-border">
          <div className="flex items-center gap-1 overflow-x-auto">
            {toolbarButtons.map((btn, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => insertMarkdown(btn.before, btn.after, btn.placeholder)}
                title={btn.label}
              >
                <btn.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
          <TabsList className="h-8">
            <TabsTrigger value="write" className="text-xs px-3 h-7">Escrever</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs px-3 h-7">Pré-visualizar</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={20}
            className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm resize-none"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="min-h-[480px] p-4 prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-secondary prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">Nada para pré-visualizar ainda...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/30 px-3 py-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Suporta Markdown: **negrito**, _itálico_, # títulos, - listas, [links](url), ![imagens](url), `código`
        </p>
      </div>
    </div>
  );
}
