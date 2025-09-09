import Link from 'next/link';
import Image from 'next/image';

export default function BrandLogo({ 
  variant = 'default', 
  size = 'medium', 
  className = '',
  showText = true 
}) {
  const sizeClasses = {
    mini: { width: 20, height: 20 },
    small: { width: 32, height: 32 },
    medium: { width: 40, height: 40 },
    large: { width: 48, height: 48 },
    hero: { width: 80, height: 80 }
  };

  const textSizeClasses = {
    mini: 'text-xs',
    small: 'text-lg',
    medium: 'text-xl', 
    large: 'text-2xl',
    hero: 'text-4xl'
  };

  const variantClasses = {
    default: 'text-alloui-primary',
    white: 'text-white',
    dark: 'text-black',
    responsive: 'text-gray-900 dark:text-white',
    gold: 'text-[#d4b24c]',
    navy: 'text-[#031a39]',
    basketball: 'text-orange-600'
  };

  return (
    <Link 
      href="/" 
      className={`flex items-center no-underline hover:scale-105 active:scale-95 transition-all duration-200 ${className}`}
      aria-label="CBL_alloui - Return to Home"
    >
      {/* Logo Image */}
      <div className="mr-2 flex items-center justify-center">
        <Image
          src="/icons/logomark.svg"
          alt="alloui by CBL Logo"
          width={sizeClasses[size].width}
          height={sizeClasses[size].height}
          className="object-contain"
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <span className={`font-heading font-bold ${textSizeClasses[size]} ${variantClasses[variant]} tracking-tight`}>
          alloui
        </span>
      )}
    </Link>
  );
}