import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import {
  ClerkProvider,
} from '@clerk/nextjs'

const font = localFont({
  src: "./fonts/Urbanist-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-urbanist",
});

export const metadata: Metadata = {
  title: "MARMARA SPRA – PIZZA & KEBAB",
  description: "MARMARA SPRA – PIZZA & KEBAB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: {
          colorPrimary: '#FE724C', 
          colorTextOnPrimaryBackground: 'black',
          fontSize: '1rem',
        },
        elements: {
          formFieldInput: {
            height: "100px",
          }
        }
      }}
    >
      <html lang="en">
        <body className={`${font.className} antialiased`}>
          <Toaster />
          {children}
        </body>
      </html>
  </ClerkProvider>
  );
}
