"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

interface MarkdownRendererProps {
  filePath: string;
  title?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export default function MarkdownRenderer({
  filePath,
  title,
  showBackButton = true,
  backUrl = "/docs",
}: MarkdownRendererProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch markdown content from the docs directory
        const response = await fetch(
          `/api/docs?file=${encodeURIComponent(filePath)}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load documentation: ${response.statusText}`
          );
        }

        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load documentation"
        );
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [filePath]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Documentation Not Found
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            {showBackButton && (
              <Link href={backUrl}>
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Documentation
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        {showBackButton && (
          <Link href={backUrl}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Button>
          </Link>
        )}
        {title && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
      </div>

      {/* Markdown Content */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <div className="prose prose-base prose-gray dark:prose-invert max-w-none p-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom heading components with better styling
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0 border-b border-gray-200 dark:border-gray-700 pb-4">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 mt-8 first:mt-0 flex items-center">
                    <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full mr-3"></div>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 mt-6 first:mt-0">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2 mt-4 first:mt-0">
                    {children}
                  </h4>
                ),
                // Enhanced paragraph styling
                p: ({ children }) => (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                    {children}
                  </p>
                ),
                // Enhanced list styling
                ul: ({ children }) => (
                  <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="space-y-2 mb-6 text-gray-700 dark:text-gray-300 list-decimal list-inside">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {children}
                  </li>
                ),
                // Enhanced blockquote styling
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 pl-6 py-4 my-6 rounded-r-lg">
                    <div className="text-gray-700 dark:text-gray-300 italic text-sm">
                      {children}
                    </div>
                  </blockquote>
                ),
                // Enhanced link styling
                a: ({ href, children, ...props }) => {
                  const isExternal = href?.startsWith("http");
                  return (
                    <a
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center font-medium transition-colors duration-200 underline decoration-2 underline-offset-2 text-sm"
                      {...props}
                    >
                      {children}
                      {isExternal && <ExternalLink className="w-3 h-3 ml-1" />}
                    </a>
                  );
                },
                // Enhanced code block styling
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;
                  return !isInline ? (
                    <div className="my-6">
                      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <div className="bg-gray-800 dark:bg-gray-700 px-4 py-2 border-b border-gray-700 dark:border-gray-600">
                          <span className="text-gray-400 text-xs font-mono">
                            {match ? match[1] : "code"}
                          </span>
                        </div>
                        <pre className="p-4 overflow-x-auto">
                          <code
                            className={`${className} text-gray-100 text-xs`}
                            {...props}
                          >
                            {children}
                          </code>
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <code
                      className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // Enhanced table styling
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {children}
                  </tbody>
                ),
                th: ({ children }) => (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                    {children}
                  </td>
                ),
                // Enhanced horizontal rule
                hr: () => (
                  <hr className="my-8 border-gray-200 dark:border-gray-700" />
                ),
                // Enhanced strong/bold text
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900 dark:text-white text-sm">
                    {children}
                  </strong>
                ),
                // Enhanced emphasis/italic text
                em: ({ children }) => (
                  <em className="italic text-gray-600 dark:text-gray-400 text-sm">
                    {children}
                  </em>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
