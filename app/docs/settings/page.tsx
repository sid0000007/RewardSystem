import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function SettingsDocsPage() {
  return (
    <MarkdownRenderer
      filePath="settings.md"
      title="Settings & Preferences"
      showBackButton={true}
      backUrl="/docs"
    />
  );
}
