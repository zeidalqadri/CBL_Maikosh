import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import MainLayout from '../../layouts/MainLayout';
import DrillBuilder from '../../components/tools/DrillBuilder';
import Footer from '../../components/Footer';

export default function DrillBuilderPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/tools/drill-builder');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-alloui-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading drill builder...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <MainLayout>
      <Head>
        <title>Interactive Drill Builder | alloui by CBL</title>
        <meta name="description" content="Design custom basketball drills with our interactive drag-and-drop drill builder. Create, save, and share practice drills with the alloui coaching community." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Icons & Manifest */}
        <link rel="icon" href="/icons/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/icons/site.webmanifest" />
        <meta name="theme-color" content="#031a39" />
        
        {/* Social cards */}
        <meta property="og:title" content="Interactive Drill Builder | alloui by CBL" />
        <meta property="og:description" content="Design custom basketball drills with our interactive drag-and-drop drill builder." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="alloui by CBL" />
        <meta property="og:image" content="/icons/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Interactive Drill Builder - alloui by CBL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Interactive Drill Builder | alloui by CBL" />
        <meta name="twitter:description" content="Design custom basketball drills with our interactive drag-and-drop drill builder." />
        <meta name="twitter:image" content="/icons/twitter-card.png" />
        <meta name="twitter:creator" content="@CBLcoaching" />
        
        {/* SEO meta */}
        <meta name="keywords" content="basketball drill builder, coaching tools, practice planning, drill design, basketball drills, coaching software, Malaysia basketball" />
        <meta name="author" content="CBL" />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <DrillBuilder />
        </div>
      </div>
      
      <Footer />
    </MainLayout>
  );
}