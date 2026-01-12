import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 면접 연습",
  description: "AI가 생성한 맞춤형 면접 질문으로 연습하고 실시간 피드백을 받아보세요.",
  keywords: ["면접", "AI", "면접 연습", "취업", "코딩 면접", "기술 면접"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
