import "./globals.css";

export const metadata = {
  title: "Digital Booklet",
  description: "Realistic book-style flipbook viewer"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
