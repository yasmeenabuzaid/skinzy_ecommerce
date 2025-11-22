import ProductListClient from '../../components/ProductListClient';
import conn from '../../../../services/connectors/BackendConnector';

export default async function BrandPage({ params, searchParams }) {
    // 1. استخراج المتغيرات (الصفحة والـ ID)
    const page = searchParams?.page || 1;
    const brandId = params?.id;

    // 2. جلب البيانات من السيرفر مباشرة
    const response = await conn.fetchProductsByBrand({ 
        brandId: brandId, 
        page: page 
    });

    // 3. معالجة البيانات (نفس المنطق المستخدم سابقاً لضمان استخراج البيانات الصحيحة)
    let paginator = {};
    
    // التحقق مما إذا كان الرد هو الـ Paginator مباشرة أو مغلف داخل data
    if (response && response.current_page) {
        paginator = response;
    } else if (response && response.data) {
        paginator = response.data;
    }

    // 4. تجهيز المصفوفة ومعلومات الصفحات
    const products = paginator.data || [];
    
    const paginationInfo = {
        currentPage: paginator.current_page || parseInt(page),
        lastPage: paginator.last_page || 1,
        total: paginator.total || 0
    };

    // 5. عرض المكون المشترك (ProductListClient)
    // ملاحظة: نمرر brandId في خانة categoryId لأن المكون يستخدمه كمعرف عام
    return (
        <ProductListClient 
            initialProducts={products} 
            paginationInfo={paginationInfo}
            categoryId={brandId} 
        />
    );
}