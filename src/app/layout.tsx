import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme";

const manrope = Manrope({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "voxcap",
  description: "AI powerd video platdoem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> 
      <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className} bg-[#171717]`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
