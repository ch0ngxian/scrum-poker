import "./globals.css";
import { Inter } from "next/font/google";
import { UserProvider } from "./user-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Scrum Poker",
  description: "Estimate story point easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
