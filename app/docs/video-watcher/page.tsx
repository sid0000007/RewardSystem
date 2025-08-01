import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function VideoWatcherDocsPage() {
  return (
    <MarkdownRenderer
      filePath="video-watcher.md"
      title="Video Watcher Documentation"
      showBackButton={true}
      backUrl="/docs"
    />
  );
}
