import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function GettingStartedDocsPage() {
  return (
    <MarkdownRenderer
      filePath="getting-started.md"
      title="Getting Started Guide"
      showBackButton={true}
      backUrl="/docs"
    />
  );
}
