import Link from 'next/link';
import BrandLogo from './BrandLogo';

/**
 * Footer - Minimal footer matching header aesthetic
 * Consistent with ecrin.digital design principles
 */
export default function Footer({ className = '' }) {
  return (
    <footer className={`
      bg-white dark:bg-gray-900 
      border-t border-gray-200 dark:border-gray-800
      py-8 md:py-12
      ${className}
    `}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Brand section */}
            <div className="md:col-span-4">
              <div className="mb-4">
                <BrandLogo 
                  size="large" 
                  variant="responsive"
                  showText={true}
                />
              </div>
              <p className="text-small text-gray-600 dark:text-gray-400 leading-relaxed">
                MABA/NSC certified basketball coaching excellence for Malaysia's diverse basketball community.
              </p>
            </div>

            {/* Navigation links */}
            <div className="md:col-span-3 md:col-start-7">
              <h3 className="text-small font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                Navigation
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/modules" 
                    className="text-small text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
                  >
                    Modules
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/resources" 
                    className="text-small text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/profile" 
                    className="text-small text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Program info */}
            <div className="md:col-span-3 md:col-start-10">
              <h3 className="text-small font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                Certification
              </h3>
              <ul className="space-y-3">
                <li className="text-tiny text-gray-600 dark:text-gray-400">
                  MABA Endorsed Program
                </li>
                <li className="text-tiny text-gray-600 dark:text-gray-400">
                  NSC Certified
                </li>
                <li className="text-tiny text-gray-600 dark:text-gray-400">
                  Level I Coaching
                </li>
              </ul>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-tiny text-gray-500 dark:text-gray-500 mb-4 md:mb-0">
              © 2024 CBL_alloui. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/privacy" 
                className="text-tiny text-gray-500 dark:text-gray-500 hover:text-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <Link 
                href="/terms" 
                className="text-tiny text-gray-500 dark:text-gray-500 hover:text-accent transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}