import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-secondary hover:prose-a:text-secondary/80 prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-l-secondary prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:text-foreground prose-img:rounded-lg prose-img:shadow-md">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-foreground">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-foreground">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-lg md:text-xl font-semibold mt-6 mb-2 text-foreground">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-4 space-y-2 text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 my-4 space-y-2 text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-muted-foreground">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-secondary pl-4 py-2 my-4 bg-muted/30 rounded-r-lg">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <figure className="my-6">
              <img 
                src={src} 
                alt={alt || ''} 
                className="w-full rounded-lg shadow-md"
                loading="lazy"
              />
              {alt && (
                <figcaption className="text-center text-sm text-muted-foreground mt-2">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-4 py-2 text-muted-foreground">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
