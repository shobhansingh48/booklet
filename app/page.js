import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <div className="home-card">
        <div className="book-icon">BOOKLET</div>
        <h1>Digital Booklet</h1>
        <p>Real book-style cover, double-page reading and page turning.</p>
        <Link href="/book/demo-book" className="open-button">Open Book</Link>
      </div>
    </main>
  );
}
