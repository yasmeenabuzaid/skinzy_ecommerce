import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import useCategoryQuery from "../../../../hooks/useSubCategoryQuery"; 
import CartDrawer from "../cart/CartDrawer";
import { useCartContext } from "../../../../context/CartContext";
import SearchBar from "./SearchBar";
import SearchModal from "./SearchModal";
import { useLocale, useTranslations } from 'next-intl';

const ChevronDown = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Menu = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);
const User = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const ShoppingBag = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" x2="21" y1="6" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const X = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);
const Globe = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const Facebook = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22.675 0h-21.35C.6 0 0 .6 0 1.342v21.317C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.466.098 2.797.142v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.588l-.467 3.622h-3.121V24h6.116c.725 0 1.324-.6 1.324-1.341V1.342C24 .6 23.4 0 22.675 0z" />
  </svg>
);
const Instagram = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2a1 1 0 110 2 1 1 0 010-2zm-4.25 1.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 1.5a3 3 0 100 6 3 3 0 000-6z" />
  </svg>
);

const LanguageSwitcher = () => {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // Extract path without locale prefix (assumes locale is first segment)
  const segments = pathname.split('/').filter(Boolean);
  segments.shift(); // remove current locale

  // Handler to switch language
  const switchLanguage = (newLocale) => {
    // Redirect to same path with new locale prefix
    const newPath = `/${newLocale}/${segments.join('/')}`;
    router.push(newPath);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 text-stone-50 hover:text-amber-100 cursor-pointer">
        <Globe size={16} />
        <span className="text-sm">{t("language")}</span>
        <ChevronDown size={14} />
      </button>
      <div className="absolute top-full right-0 mt-2 w-28 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
        <button
          onClick={() => switchLanguage('en')}
          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
            locale === 'en' ? 'font-bold text-amber-600' : 'text-gray-700'
          }`}
        >
          {t("english")}
        </button>
        <button
          onClick={() => switchLanguage('ar')}
          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
            locale === 'ar' ? 'font-bold text-amber-600' : 'text-gray-700'
          }`}
        >
          {t("arabic")}
        </button>
      </div>
    </div>
  );
};

const TopBar = () => {
  const t = useTranslations("Header");
  return (
    <div className="bg-black text-white text-xs border-b border-gray-800">
      <div className="container mx-auto px-4 h-10 flex items-center justify-center">
        <div className="w-full flex justify-between items-center">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-3">
              <Link href="https://www.facebook.com/profile.php?id=61574964286607&rdid=0k8iaoTm0BuSADV7" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-amber-300 transition-colors"><Facebook className="w-4 h-4" /></Link>
              <Link href="https://www.instagram.com/skincarejo8" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-amber-300 transition-colors"><Instagram className="w-4 h-4" /></Link>
            </div>
            <span className="ml-4">{t("callUs")}</span>
          </div>
          <span className="text-center">{t("newsletter")}</span>
          <div className="hidden md:flex items-center gap-5">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryMegaMenu = ({ category }) => {
  const subCategories = category.subcategories || [];
  const locale = useLocale();

  return (
    <div className="mega-menu absolute top-full left-1/2 lg:w-[1200px]  -translate-x-1/2 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2.5 z-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-8 min-h-[150px]">
        <div className="flex gap-8">
          <div className="flex-1">
<h4 className="font-semibold text-base mb-5 text-gray-800">
  {locale === "ar" ? category.name_ar : category.name}
</h4>
            <ul className="space-y-2.5">
            {subCategories.map((subCategory) => (
  <li key={subCategory.id}>
    <Link href={`/${locale}/subcategory/${subCategory.id}`} className="text-gray-500 hover:text-gray-800 text-sm">
      {locale === "ar" ? subCategory.name_ar : subCategory.name}
    </Link>
  </li>
))}

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainNav = ({ onCartToggle, onMenuToggle, cartItemCount, onSearchClick }) => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const { categories, isLoadingCategories, errorCategories } = useCategoryQuery();
  const t = useTranslations("Header");

const navLinks = [
  { id: 'home', name: t("home"), href: `/${locale}/`, subcategories: [] },
  ...(categories || []).map(cat => ({
    ...cat,
    name: locale === "ar" ? cat.name_ar : cat.name,
    subcategories: (cat.subcategories || []).map(sub => ({
      ...sub,
      name: locale === "ar" ? sub.name_ar : sub.name
    })),
    href: `/${locale}/category/${cat.id}`,
  }))
];


  return (
    <nav className="bg-white border-b border-gray-200 relative">
      <div className="container mx-auto px-4 flex items-center justify-between h-24">
        <Link href={`/${locale}/`} className="block w-[160px] h-auto">
          <Image src="/logo.png" alt="Essentia Logo" width={180} height={80} priority />
        </Link>

        <ul className="hidden lg:flex items-center gap-10">
          {isLoadingCategories && <li className="text-sm text-gray-500">{t("loadingCategories")}</li>}
          {errorCategories && <li className="text-sm text-red-500">{t("errorLoadingCategories")}</li>}

          {!isLoadingCategories && !errorCategories && navLinks.map((link) => {
            const hasSubCategories = link.subcategories && link.subcategories.length > 0;
            return (
              <li key={link.id} className="group relative">
                {link.id === 'home' ? (
                  <Link href={link.href} className="text-gray-800 font-medium text-sm flex items-center gap-1 py-2.5 cursor-pointer">
                    {link.name}
                  </Link>
                ) : hasSubCategories ? (
                  <span className="text-gray-800 font-medium text-sm flex items-center gap-1 py-2.5 cursor-default">
                    {link.name} <ChevronDown size={14} />
                  </span>
                ) : (
                  <span className="text-gray-800 font-medium text-sm flex items-center gap-1 py-2.5 cursor-default">
                    {link.name}
                  </span>
                )}

                {hasSubCategories && <CategoryMegaMenu category={link} />}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-6">
          <SearchBar onSearchClick={onSearchClick} />
          <Link href={`/${locale}/profile`} aria-label="User Account" className="text-gray-700 hover:text-black hidden md:block transition-transform hover:scale-110 cursor-pointer">
            <User size={20} />
          </Link>
          <button onClick={onCartToggle} aria-label="Shopping Cart" className="relative text-gray-700 hover:text-black transition-transform hover:scale-110 cursor-pointer">
            <ShoppingBag size={22} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-gray-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold">
                {cartItemCount}
              </span>
            )}
          </button>
          <button onClick={onMenuToggle} className="lg:hidden text-gray-800 transition-transform hover:scale-110 cursor-pointer" aria-label="Open navigation menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const MobileNav = ({ isOpen, onClose }) => {
  const { categories, isLoadingCategories, errorCategories } = useCategoryQuery();
  console.log("in nav",categories)
  const [openMenus, setOpenMenus] = useState({});
  const locale = useLocale();
  const t = useTranslations("Header");

const navLinks = [
  { id: 'home', name: t("home"), href: `/${locale}/`, subcategories: [] },
  ...(categories || []).map(cat => ({
    ...cat,
    name: locale === "ar" ? cat.name_ar : cat.name,
    subcategories: (cat.subcategories || []).map(sub => ({
      ...sub,
      name: locale === "ar" ? sub.name_ar : sub.name
    })),
    href: `/${locale}/category/${cat.id}`,
  }))
];


  const toggleMenu = (linkId) => {
    setOpenMenus(prev => ({ ...prev, [linkId]: !prev[linkId] }));
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={onClose}></div>
      <div className={`fixed top-0 left-0 h-full w-72 max-w-[80%] bg-white z-50 shadow-xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <Link href={`/${locale}/`} className="text-2xl font-bold text-gray-800">Essentia</Link>
          <button onClick={onClose} aria-label="Close navigation menu"><X size={28} /></button>
        </div>
        <div className="p-5 overflow-y-auto">
          <ul className="flex flex-col">
            {isLoadingCategories && <li className="py-4 text-gray-500">{t("loading")}</li>}
            {errorCategories && <li className="py-4 text-red-500">{t("error")}</li>}
            {!isLoadingCategories && !errorCategories && navLinks.map((link) => {
              const hasSubCategories = link.subcategories && link.subcategories.length > 0;
              return (
                <li key={link.id} className="border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <Link href={link.href} className="block py-4 font-medium text-gray-700">{link.name}</Link>
                    {hasSubCategories && (
                      <button onClick={() => toggleMenu(link.id)} className="p-2 cursor-pointer">
                        <ChevronDown size={20} className={`transition-transform ${openMenus[link.id] ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  {hasSubCategories && openMenus[link.id] && (
                    <div className="pl-4 pb-2">
                      <ul className="space-y-2">
                        {link.subcategories.map(subLink => (
                          <li key={subLink.id}>
<Link href={`/${locale}/subcategory/${subLink.id}`} className="text-gray-500 text-sm py-1 block">
  {subLink.name}
</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

const Header = ({ onCartToggle, onMenuToggle, cartItemCount, onSearchClick }) => (
  <header className="relative z-30">
    <TopBar />
    <MainNav
      onCartToggle={onCartToggle}
      onMenuToggle={onMenuToggle}
      cartItemCount={cartItemCount}
      onSearchClick={onSearchClick}
    />
  </header>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { cart, updateCart } = useCartContext() || { cart: [], updateCart: () => { } };
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Header
        onMenuToggle={() => setIsMenuOpen(true)}
        onCartToggle={() => setIsCartOpen(true)}
        cartItemCount={totalCartItems}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={updateCart}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
