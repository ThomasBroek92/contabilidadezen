import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

function childrenToText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (React.isValidElement(children) && children.props?.children) {
    return childrenToText(children.props.children);
  }
  return '';
}

function generateHeadingId(children: React.ReactNode): string {
  const text = childrenToText(children);
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function isInternalLink(href: string | undefined): boolean {
  if (!href) return false;
  if (href.startsWith('/')) return true;
  if (href.includes('contabilidadezen.com.br')) return true;
  return false;
}

/**
 * Strip elements that should not be visible in the rendered post:
 * - <script> blocks (JSON-LD is handled by BlogPostSEO via Helmet)
 * - Inline "Autor:" lines (AuthorBox component handles this already)
 * - Trailing horizontal rules left after stripping
 */
function cleanContent(raw: string): string {
  return raw
    // Remove any <script>...</script> blocks (multiline)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    // Remove standalone "Autor: ..." lines (bold or plain)
    .replace(/^\*{0,2}Autor:.*\*{0,2}\s*$/gim, '')
    // Collapse more than two consecutive blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const sanitized = cleanContent(content);
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-secondary hover:prose-a:text-secondary/80 prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground prose-blockquote:text-muted-foreground prose-blockquote:border-l-secondary prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:text-foreground prose-img:rounded-lg prose-img:shadow-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 id={generateHeadingId(children)} className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-foreground">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 id={generateHeadingId(children)} className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={generateHeadingId(children)} className="text-lg md:text-xl font-semibold mt-6 mb-2 text-foreground">
              {children}
            </h3>
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
          a: ({ href, children }) => {
            const internal = isInternalLink(href);
            return (
              <a 
                href={href} 
                {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className="text-secondary hover:text-secondary/80 underline underline-offset-2"
              >
                {children}
              </a>
            );
          },
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
        {sanitized}
      </ReactMarkdown>
    </div>
  );
}
