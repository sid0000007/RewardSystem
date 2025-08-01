import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function TroubleshootingDocsPage() {
  return (
    <MarkdownRenderer
      filePath="troubleshooting.md"
      title="Troubleshooting Guide"
      showBackButton={true}
      backUrl="/docs"
    />
  );
}
