function stripHtml(html: string): string {
  // Use a consistent regex approach for both server and client
  return html.replace(/<[^>]*>/g, "")
}

interface HtmlPreviewProps {
  htmlString: string
  lines?: number // allow control of visible lines
}

const HtmlPreview: React.FC<HtmlPreviewProps> = ({ htmlString, lines = 2 }) => {
  // Use the same logic for both server and client to prevent hydration mismatch
  const plainText = stripHtml(htmlString)

  return (
    <p className={`line-clamp-${lines} overflow-hidden text-ellipsis whitespace-nowrap`}>
      {plainText}
    </p>
  )
}

export default HtmlPreview
