'use client';
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

// Assuming these are your actual imports
import useCategoryQuery from "../../../../hooks/useSubCategoryQuery";
import CartDrawer from "../cart/CartDrawer";
import { useCartContext } from "../../../../context/CartContext";
import SearchModal from "./SearchModal";
import { useLocale, useTranslations } from "next-intl";

// This is a mock/example service.
const StorageService = {
  getUserInfo: () => {
    try {
        const item = window.localStorage.getItem("customerInfo");
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Could not access localStorage.", error);
        return null;
    }
  },
};

// --- SVG Icons ---
const UserCircleIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="10" r="4" />
        <path d="M6.3 20.7c1.5-2.5 4.3-4.2 7.7-4.2s6.2 1.7 7.7 4.2" />
    </svg>
);
const LoginIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);
const Heart = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
);
const ChevronDown = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6" /></svg>
);
const Menu = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
);
const ShoppingBag = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
);
const X = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>
);
const Globe = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
);
const Facebook = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.6 0 0 .6 0 1.342v21.317C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.466.098 2.797.142v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.588l-.467 3.622h-3.121V24h6.116c.725 0 1.324-.6 1.324-1.341V1.342C24 .6 23.4 0 22.675 0z" /></svg>
);
const Instagram = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2a1 1 0 110 2 1 1 0 010-2zm-4.25 1.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 1.5a3 3 0 100 6 3 3 0 000-6z" /></svg>
);
const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);


// --- Components ---

function SearchBar({ onSearchClick }) {
  return (
    <button
      aria-label="Search"
      className="text-gray-700 hover:text-black transition-transform hover:scale-110 cursor-pointer"
      onClick={onSearchClick}
    >
      <SearchIcon className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  );
}

const LanguageSwitcher = () => {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const segments = pathname.split("/").filter(Boolean);
  segments.shift();

  const switchLanguage = (newLocale) => {
    const newPath = `/${newLocale}/${segments.join("/")}`;
    router.push(newPath);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-1 cursor-pointer">
        <Globe className="w-5 h-5 md:w-6 md:h-6"/>
        <span className="hidden sm:inline text-sm">{t("language")}</span>
        <ChevronDown className={`hidden sm:inline transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`} size={14}/>
      </button>
      <div className={`absolute top-full right-0 mt-2 w-28 bg-white rounded-md shadow-lg transition-all z-50 border border-gray-100 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <button onClick={() => switchLanguage("en")} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${locale === "en" ? "font-bold text-amber-600" : "text-gray-700"}`}>
          {t("english")}
        </button>
        <button onClick={() => switchLanguage("ar")} className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${locale === "ar" ? "font-bold text-amber-600" : "text-gray-700"}`}>
          {t("arabic")}
        </button>
      </div>
    </div>
  );
};

const TopBar = () => {
  const t = useTranslations("Header");
  return (
    <div className="bg-[#FF671F] text-white text-xs border-b border-[#FF671F]-800">
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
    <div className="mega-menu absolute top-full left-1/2 lg:w-[1200px] -translate-x-1/2 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2.5 z-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-8 min-h-[150px]">
        <div className="flex gap-8">
          <div className="flex-1">
            <h4 className="font-semibold text-base mb-5 text-gray-800">{locale === "ar" ? category.name_ar : category.name}</h4>
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
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = StorageService.getUserInfo();
    if (userInfo) {
      setIsLoggedIn(true);
    }
  }, []);

  const navLinks = [
    { id: "home", name: t("home"), href: `/${locale}/`, subcategories: [] },
    ...(categories || []).map((cat) => ({
      ...cat,
      name: locale === "ar" ? cat.name_ar : cat.name,
      subcategories: (cat.subcategories || []).map((sub) => ({ ...sub, name: locale === "ar" ? sub.name_ar : sub.name })),
      href: `/${locale}/category/${cat.id}`,
    })),
  ];

  return (
    <nav className="bg-white border-b border-gray-200 relative">
      <div className="container mx-auto px-4 flex items-center justify-between h-24">
        <div className="flex-shrink-0">
<div className="flex-shrink-0">
  {/* الحل: مقاس للموبايل والتابلت، ومقاس أكبر للابتوب */}
  <Link href={`/${locale}/`} className="block w-[150px] lg:w-[220px] h-auto">
    {/* نُبقي أبعاد الصورة على أعلى قيمة لضمان الجودة */}
    <Image src="/logo.png" alt="skinzy care" width={250} height={188} priority />
  </Link>
</div>
        </div>

        <ul className="hidden lg:flex items-center gap-10 mx-auto">
          {isLoadingCategories && <li className="text-sm text-gray-500">{t("loadingCategories")}</li>}
          {errorCategories && <li className="text-sm text-red-500">{t("errorLoadingCategories")}</li>}
          {!isLoadingCategories && !errorCategories && navLinks.map((link) => {
            const hasSubCategories = link.subcategories && link.subcategories.length > 0;
            return (
              <li key={link.id} className="group relative">
                {/* ✨ --- START: Correction --- ✨ */}
                {/* Now, all category names are clickable links */}
                <Link 
                  href={link.href} 
                  className="text-gray-800 font-medium text-sm flex items-center gap-1 py-2.5 cursor-pointer"
                >
                  {link.name}
                  {/* The chevron only shows for non-home links that have subcategories */}
                  {hasSubCategories && link.id !== "home" && <ChevronDown size={14} />}
                </Link>
                {/* ✨ --- END: Correction --- ✨ */}
                
                {hasSubCategories && <CategoryMegaMenu category={link} />}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 md:gap-4">
          <SearchBar onSearchClick={onSearchClick} />
          <div className="md:hidden text-gray-700">
            <LanguageSwitcher />
          </div>
          
          {isLoggedIn ? (
            <Link href={`/${locale}/profile`} aria-label="User Account" className="text-gray-700 hover:text-black transition-transform hover:scale-110 cursor-pointer">
              <UserCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
          ) : (
            <Link href={`/${locale}/auth/login`} aria-label="Login" className="text-gray-700 hover:text-black transition-transform hover:scale-110 cursor-pointer">
              <LoginIcon className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
          )}
          
          <Link href={`/${locale}/favorite`} aria-label="favorite" className="text-gray-700 hover:text-black transition-transform hover:scale-110 cursor-pointer">
            <Heart className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          
          <button onClick={onCartToggle} aria-label="Shopping Cart" className="relative text-gray-700 hover:text-black transition-transform hover:scale-110 cursor-pointer">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-[#FF671F] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold">
                {cartItemCount}
              </span>
            )}
          </button>
          <button onClick={onMenuToggle} className="lg:hidden text-gray-800 transition-transform hover:scale-110 cursor-pointer" aria-label="Open navigation menu">
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const MobileNav = ({ isOpen, onClose }) => {
  const { categories, isLoadingCategories, errorCategories } = useCategoryQuery();
  const [openMenus, setOpenMenus] = useState({});
  const locale = useLocale();
  const t = useTranslations("Header");

  const navLinks = [
    { id: "home", name: t("home"), href: `/${locale}/`, subcategories: [] },
    ...(categories || []).map((cat) => ({
      ...cat,
      name: locale === "ar" ? cat.name_ar : cat.name,
      subcategories: (cat.subcategories || []).map((sub) => ({ ...sub, name: locale === "ar" ? sub.name_ar : sub.name })),
      href: `/${locale}/category/${cat.id}`,
    })),
  ];

  const toggleMenu = (linkId) => {
    setOpenMenus((prev) => ({ ...prev, [linkId]: !prev[linkId] }));
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={onClose}></div>
      <div className={`fixed top-0 left-0 h-full w-72 max-w-[80%] bg-white z-50 shadow-xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          
          <Link href={`/${locale}/`} className="block w-[120px] h-auto">
             <Image src="/logo.png" alt="skinzy care" width={150} height={60} priority />
          </Link>

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
                        {link.subcategories.map((subLink) => (
                          <li key={subLink.id}>
                            <Link href={`/${locale}/subcategory/${subLink.id}`} className="text-gray-500 text-sm py-1 block">{subLink.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

const Header = ({ onCartToggle, onMenuToggle, cartItemCount, onSearchClick, isSticky }) => (
  <header className={`z-30 transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 w-full bg-white shadow-lg' : 'relative'}`}>
    <TopBar />
    <MainNav onCartToggle={onCartToggle} onMenuToggle={onMenuToggle} cartItemCount={cartItemCount} onSearchClick={onSearchClick} />
  </header>
);

// --- ✅ الكود المُعدل والمُصحح ---
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // 💡 1. تم توحيد الاستدعاء وإضافة قيم افتراضية قوية
  const { cart, updateCart, cartCount } = useCartContext() || { 
    cart: [], 
    updateCart: () => {}, 
    cartCount: 0 
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 💡 2. الحل: "تنظيف" بيانات السلة قبل تمريرها
  // هذا يضمن أن .toFixed سيعمل دائمًا داخل CartDrawer
  const sanitizedCart = (cart || []).map(item => ({
    ...item,
    // نفترض أن الخصائص التي تسبب المشكلة هي 'price' أو 'sale_price'
    // نقوم بتحويلها إلى أرقام
    price: parseFloat(item.price) || 0,
    
    // يمكنك إضافة أي حقول سعر أخرى قد تكون موجودة
    // sale_price: parseFloat(item.sale_price) || 0, 
  }));
  
  return (
    <div className="font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Header 
        isSticky={isSticky}
        onMenuToggle={() => setIsMenuOpen(true)} 
        onCartToggle={() => setIsCartOpen(true)} 
        cartItemCount={cartCount}
        onSearchClick={() => setIsSearchOpen(true)} 
      />
      {isSticky && <div style={{ height: '136px' }} />}

      <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* 💡 3. تمرير البيانات النظيفة (sanitizedCart) بدلاً من (cart) */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={sanitizedCart} 
        onRemoveItem={updateCart} 
      />
      
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}