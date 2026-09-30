import BookViewer from "@/components/BookViewer";

export default async function BookPage({ params }) {
  const { bookId } = await params;

  return (
    <BookViewer
      book={{
        id: bookId,
        title: "Concept Art Diploma",
        pages: 8
      }}
    />
  );
}
