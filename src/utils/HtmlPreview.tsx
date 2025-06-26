function stripHtml(html: string): string {
  // Use a consistent regex approach for both server and client
  return html.replace(/<[^>]*>/g, "");
}

function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "…" : text;
}

interface HtmlPreviewProps {
  htmlString: string;
  maxLength?: number;
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({
  htmlString,
  maxLength = 100,
}) => {
  // Use the same logic for both server and client to prevent hydration mismatch
  const plainText = stripHtml(htmlString);
  const truncated = truncate(plainText, maxLength);

  return <p>{truncated}</p>;
};

export default HtmlPreview;
