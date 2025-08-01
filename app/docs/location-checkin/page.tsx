import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function LocationCheckinDocsPage() {
  return (
    <MarkdownRenderer
      filePath="location-checkin.md"
      title="Location Check-in Documentation"
      showBackButton={true}
      backUrl="/docs"
    />
  );
}
