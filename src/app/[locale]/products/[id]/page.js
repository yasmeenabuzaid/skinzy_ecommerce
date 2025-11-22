import ProductPageClient from '../../components/ProductPage/ProductPageClient';
import conn from '../../../../services/connectors/BackendConnector';

// Metadata (SEO)
export async function generateMetadata({ params }) {
    // 🟢 1. انتظار الباراميترز (ضروري في Next.js 15)
    const { id } = await params;
    
    const response = await conn.fetchSingleProduct(id);
    
    let product = null;
    if (response && response.id) {
        product = response;
    } else if (response?.data) {
        product = response.data.data || response.data;
    }

    if (!product) return { title: 'Product Not Found' };

    return {
        title: product.name,
        description: product.small_description,
        openGraph: {
            images: [product.image || product.images?.[0]?.image],
        },
    };
}

export default async function ProductPage({ params }) {
    // 🟢 1. انتظار الباراميترز (لحل مشكلة الـ Sync/Async)
    const { id } = await params;

    // 🟢 2. جلب البيانات بشكل متوازي (المنتج الحالي + منتجات مقترحة)
    const [productResponse, relatedResponse] = await Promise.all([
        conn.fetchSingleProduct(id),
        conn.fetchProducts({ limit: 4 }) // نجلب 4 منتجات عشوائية للشبكة
    ]);

    // 🟢 3. استخراج تفاصيل المنتج (نفس المنطق السابق)
    let product = null;
    if (productResponse && productResponse.id) {
        product = productResponse;
    } else if (productResponse?.data) {
        product = productResponse.data.data || productResponse.data;
    }

    // 🟢 4. استخراج المنتجات المقترحة (تنظيف البيانات)
    let relatedProducts = [];
    const relatedData = relatedResponse?.data || relatedResponse;
    
    if (relatedData?.products) {
        relatedProducts = relatedData.products;
    } else if (Array.isArray(relatedData?.data)) {
        relatedProducts = relatedData.data;
    } else if (Array.isArray(relatedData)) {
        relatedProducts = relatedData;
    }

    // التحقق النهائي
    if (!product || !product.id) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-500">Product not found</h1>
            </div>
        );
    }

    // 🟢 5. تمرير (product) و (products) للمكون التفاعلي
    return (
        <ProductPageClient 
            product={product} 
            products={relatedProducts} 
        />
    );
}