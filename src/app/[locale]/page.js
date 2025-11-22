// 📍 الملف: app/[locale]/page.js (هذا هو مكون السيرفر)

// 1. استيراد الـ "conn" بدلاً من دوال وهمية
import conn from "@/services/connectors/BackendConnector"; // ⭐️ تأكد من المسار
import HomePage from "./components/HomePage"; // 2. مكون الواجهة (الكلاينت)

// الصفحة أصبحت "async" لجلب البيانات
export default async function RealPage({ params: { locale } }) {
  
  // 3. جلب البيانات على السيرفر (بشكل متوازي)
  //    نستدعي الدوال مباشرة من الـ BackendConnector
  const [productsResponse, categoriesResponse] = await Promise.all([
    conn.fetchProducts(), // ⭐️ استدعاء دالة المنتجات
    conn.fetchCategories() // ⭐️ استدعاء دالة التصنيفات
  ]);
  // 4. تنظيف البيانات (لأن دوالك ترجع استجابة axios كاملة)
  //    نقوم بمحاكاة ما كان يفعله الـ "select" في الهوك
  
  const productsData = productsResponse?.data || [];
  const products = productsData?.products || productsData?.data || productsData || [];
  
  const categoriesData = categoriesResponse?.data || [];
const categories = categoriesResponse || [];

  // 5. تمرير البيانات الجاهزة كـ props إلى مكون الواجهة
  return (
    <HomePage
      products={products}
      categories={categories}
    />
  );
}