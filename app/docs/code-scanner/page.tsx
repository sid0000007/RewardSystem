import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function CodeScannerDocsPage() {
  return (
    <MarkdownRenderer
      filePath="code-scanner.md"
      title="Code Scanner Documentation"
      showBackButton={true}
      backUrl="/docs"
    />
  );
}
