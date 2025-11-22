import ProductListClient from '../../components/ProductListClient';
import conn from '../../../../services/connectors/BackendConnector';

export default async function Page({ params, searchParams }) {
    // 1. تحديد رقم الصفحة والـ ID
    const page = searchParams?.page || 1;
    const categoryId = params?.id;

    // 2. جلب البيانات من السيرفر
    const response = await conn.fetchProductsByCategory({ 
        CategoryId: categoryId, 
        page: page 
    });


    // 3. معالجة البيانات بذكاء (Smart Extraction)
    let paginator = {};
    let products = [];

    // التحقق مما إذا كان الـ response يحتوي على مفاتيح الـ Pagination مباشرة (كما في اللوج الخاص بك)
    if (response && response.current_page) {
        paginator = response;
    } 
    // التحقق مما إذا كان رد Axios قياسي (البيانات داخل .data)
    else if (response && response.data) {
        paginator = response.data;
    }

    // 4. استخراج المنتجات
    products = paginator.data || [];
    
    // 5. استخراج معلومات التصفح
    const paginationInfo = {
        currentPage: paginator.current_page || parseInt(page),
        lastPage: paginator.last_page || 1,
        total: paginator.total || 0
    };

    // 6. عرض الصفحة
    return (
        <ProductListClient 
            initialProducts={products} 
            paginationInfo={paginationInfo}
            categoryId={categoryId}
        />
    );
}