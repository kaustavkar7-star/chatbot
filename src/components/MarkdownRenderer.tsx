import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Simple, robust markdown-like line-by-line renderer
  const lines = content.split('\n');

  const renderFormattedInline = (text: string) => {
    // Replace markdown links [Label](url)
    const linkParts = [];
    let remaining = text;
    let keyIdx = 0;

    // Pattern for links: [title](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;

    const elements: React.ReactNode[] = [];

    while ((match = linkRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        elements.push(formatStyles(remaining.substring(lastIndex, match.index), `txt-${keyIdx++}`));
      }
      elements.push(
        <a
          key={`link-${keyIdx++}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      elements.push(formatStyles(remaining.substring(lastIndex), `txt-${keyIdx++}`));
    }

    return elements;
  };

  const formatStyles = (text: string, baseKey: string): React.ReactNode => {
    // Process bold (**bold**), code (`code`), citations ([Citation])
    // Split by **
    const boldParts = text.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={baseKey}>
        {boldParts.map((part, i) => {
          if (i % 2 === 1) {
            return (
              <strong key={`${baseKey}-b-${i}`} className="font-semibold text-slate-900">
                {part}
              </strong>
            );
          }
          // Process code `code`
          const codeParts = part.split(/`(.*?)`/g);
          return (
            <span key={`${baseKey}-p-${i}`}>
              {codeParts.map((cPart, ci) => {
                if (ci % 2 === 1) {
                  return (
                    <code
                      key={`${baseKey}-c-${ci}`}
                      className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs border border-slate-200"
                    >
                      {cPart}
                    </code>
                  );
                }
                return cPart;
              })}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className={`space-y-2 text-sm leading-relaxed text-slate-800 ${className}`}>
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={`empty-${index}`} className="h-1.5" />;
        }

        // Heading 3: ### Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={`h3-${index}`} className="font-bold text-slate-900 text-base pt-1 pb-0.5">
              {renderFormattedInline(trimmed.substring(4))}
            </h4>
          );
        }

        // Heading 2: ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={`h2-${index}`} className="font-bold text-slate-900 text-lg pt-2 pb-1 border-b border-slate-100">
              {renderFormattedInline(trimmed.substring(3))}
            </h3>
          );
        }

        // Bullet point: - item or * item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={`bullet-${index}`} className="flex items-start gap-2 pl-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
              <div className="flex-1">{renderFormattedInline(trimmed.substring(2))}</div>
            </div>
          );
        }

        // Numbered list: 1. item
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={`num-${index}`} className="flex items-start gap-2.5 pl-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs shrink-0 mt-0.5">
                {numMatch[1]}
              </span>
              <div className="flex-1">{renderFormattedInline(numMatch[2])}</div>
            </div>
          );
        }

        // Blockquote: > text
        if (trimmed.startsWith('> ')) {
          return (
            <div
              key={`quote-${index}`}
              className="border-l-4 border-blue-400 pl-3 py-1 my-1 italic bg-blue-50/50 rounded-r text-slate-700 text-xs"
            >
              {renderFormattedInline(trimmed.substring(2))}
            </div>
          );
        }

        // Standard paragraph
        return <p key={`p-${index}`}>{renderFormattedInline(line)}</p>;
      })}
    </div>
  );
};
