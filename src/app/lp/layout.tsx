import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SKILL60+ | 60年の経験が、いま求められている',
  description: 'AIの友人と3分おしゃべりするだけ。あなたの得意なことが見つかります。60歳以上の方専用。LINEで簡単・ずっと無料。',
  keywords: ['60歳以上', 'シニア', 'キャリア', 'スキル', 'AI相談', 'LINE'],
  authors: [{ name: 'SKILL60+' }],
  openGraph: {
    type: 'website',
    url: 'https://skill60plus.jp',
    title: 'SKILL60+ | 60年の経験が、いま求められている',
    description: 'AIの友人と3分おしゃべり。あなたの得意なことが見つかります。ずっと無料。',
    siteName: 'SKILL60+',
    locale: 'ja_JP',
    images: [
      {
        url: 'https://skill60plus.jp/img/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'SKILL60+ - 60年の経験が、いま求められている',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'theme-color-light': '#1B4F72',
    'theme-color-dark': '#1A1A2E',
  },
};

export default function LpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 構造化データ（Schema.org） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'SKILL60+',
            description: '60歳以上の方がAIの友人と共にスキルを再発見するサービス',
            url: 'https://skill60plus.jp',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'JPY',
            },
            audience: {
              '@type': 'PeopleAudience',
              suggestedMinAge: 60,
            },
          }),
        }}
      />
      {children}
    </>
  );
}
