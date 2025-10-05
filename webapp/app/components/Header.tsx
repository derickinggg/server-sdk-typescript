'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { 
  CubeIcon,
  PhoneIcon,
  CogIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t('nav.buildAgent'), icon: CubeIcon },
    { href: '/agents', label: t('nav.myAgents'), icon: CogIcon },
    { href: '/call', label: t('nav.makeCalls'), icon: PhoneIcon },
    { href: '/demo', label: t('nav.documentation'), icon: DocumentTextIcon },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600 p-2 rounded-lg">
              <CubeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{t('nav.title')}</h1>
              <p className="text-sm text-gray-500">{t('nav.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center text-sm transition-colors ${
                      isActive
                        ? 'text-purple-600 font-medium'
                        : 'text-gray-700 hover:text-purple-600'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-1" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}