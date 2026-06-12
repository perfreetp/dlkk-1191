import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-css';
import { cn } from '@/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  lineNumber?: number;
  className?: string;
}

export function CodeBlock({ code, language = 'typescript', lineNumber, className }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const lines = code.split('\n');

  return (
    <div className={cn('rounded-lg overflow-hidden bg-gray-900', className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        {lineNumber && (
          <span className="text-xs text-gray-400 font-mono">第 {lineNumber} 行</span>
        )}
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 m-0">
          <div className="flex">
            <div className="flex-shrink-0 pr-4 text-right text-gray-500 text-sm font-mono select-none border-r border-gray-700 mr-4">
              {lines.map((_, i) => (
                <div key={i} className="leading-6">
                  {(lineNumber || 1) + i}
                </div>
              ))}
            </div>
            <code
              ref={codeRef}
              className={`language-${language} text-sm font-mono leading-6`}
            >
              {code}
            </code>
          </div>
        </pre>
      </div>
    </div>
  );
}
