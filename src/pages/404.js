import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import BasketballErrorPage from '../components/navigation/BasketballErrorPage';

export default function Custom404() {
  return (
    <MainLayout>
      <Head>
        <title>404 - Page Not Found | alloui by CBL</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to alloui by CBL basketball coaching certification." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="404 - Page Not Found | alloui by CBL" />
        <meta property="og:description" content="The page you're looking for doesn't exist. Return to alloui by CBL basketball coaching certification." />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://alloui.ecrin.digital/404" />
        <meta property="og:site_name" content="alloui by CBL" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="404 - Page Not Found | alloui by CBL" />
        <meta name="twitter:description" content="The page you're looking for doesn't exist. Return to alloui by CBL basketball coaching certification." />
        <meta name="twitter:image" content="/icons/twitter-image.png" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://alloui.ecrin.digital/404" />
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "404 - Page Not Found",
              "description": "The page you're looking for doesn't exist.",
              "url": "https://alloui.ecrin.digital/404",
              "isPartOf": {
                "@type": "WebSite",
                "name": "alloui by CBL",
                "url": "https://alloui.ecrin.digital"
              }
            })
          }}
        />
      </Head>

      <BasketballErrorPage 
        errorCode={404}
        title="Shot Clock Violation!"
        message="The page you're looking for doesn't exist"
        showNavigation={false}
      />
    </MainLayout>
  );
}