import { AuthProvider } from '../contexts/AuthContext';
import { UserProvider as CustomUserProvider } from '../contexts/UserContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { GlobalErrorBoundary } from '../components/ErrorBoundary';
import { useEffect } from 'react';
// import errorTracker from '../utils/errorTracking';
// import performanceMonitor from '../utils/performanceMonitoring';
// import webVitalsMonitor from '../utils/webVitals';
import { SWRConfig } from 'swr';
// import { swrConfig } from '../lib/cache';
// import { preloadCriticalComponents } from '../components/LazyComponents';
import '../styles/globals.css';
import '../styles/ecrin-theme.css';

// Simple SWR config for development
const simpleSWRConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    // Simplified initialization for development
    console.log('App initialized successfully');
  }, []);

  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <CustomUserProvider>
          <ThemeProvider>
            <NavigationProvider>
              <SWRConfig value={simpleSWRConfig}>
                {getLayout(<Component {...pageProps} />)}
              </SWRConfig>
            </NavigationProvider>
          </ThemeProvider>
        </CustomUserProvider>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}

export default MyApp;