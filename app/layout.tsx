import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import {
  ClerkProvider,
} from '@clerk/nextjs'

const font = Urbanist({
  subsets: ["latin"],
  weight: ['400'],
})

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
