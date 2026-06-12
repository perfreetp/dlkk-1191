import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import { cn } from '@/utils/';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

const CodeBlock = ({
  code,
  language = 'typescript',
  showLineNumbers = true,
  highlightLines = [],
  className,
}: CodeBlockProps) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const lines = code.split('\n');

  const isHighlighted = (index: number) => {
    return highlightLines.includes(index + 1);
  };

  return (
    <div className={cn('relative rounded-lg overflow-hidden bg-gray-900', className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-medium text-gray-400 uppercase">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Copy
        </button>
      </div>
      <div className="overflow-x-auto">
        <pre className="flex">
          {showLineNumbers && (
            <div className="flex-shrink-0 py-4 text-right select-none bg-gray-900 border-r border-gray-800">
              {lines.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'px-3 text-sm leading-6',
                    isHighlighted(index)
                      ? 'text-yellow-400 bg-yellow-400/10'
                      : 'text-gray-600'
                  )}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          <code
            ref={codeRef}
            className={`language-${language} flex-1 p-4 text-sm leading-6`}
          >
            {lines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  isHighlighted(index) && 'bg-yellow-400/10 -mx-4 px-4'
                )}
              >
                {line || ' '}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export { CodeBlock };
