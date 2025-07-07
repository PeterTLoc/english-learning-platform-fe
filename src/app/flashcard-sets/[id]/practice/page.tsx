import FlashcardSetPractice from "@/components/flashcard-sets/practice/FlashcardSetPractice";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; size?: string }>;
}) {
  const { id } = await params;
  const { page, size } = await searchParams;
  const pageNumber = parseInt(page || "1", 10);
  const sizeNumber = parseInt(size || "1", 10);
  return <FlashcardSetPractice id={id} page={pageNumber} size={sizeNumber} />;
}
