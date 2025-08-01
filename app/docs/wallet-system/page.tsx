import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function WalletSystemDocsPage() {
  return (
    <MarkdownRenderer
      filePath="wallet-system.md"
      title="Wallet System Documentation"
      showBackButton={true}
      backUrl="/docs"
    />
  );
}
