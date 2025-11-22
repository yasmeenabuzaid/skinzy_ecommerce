import ProductListClient from '../../components/ProductListClient';
// تأكد من المسار الصحيح للـ Connector
import conn from '../../../../services/connectors/BackendConnector';

export default async function SubCategoryPage({ params, searchParams }) {
    // 1. استخراج المتغيرات من الرابط
    const page = searchParams?.page || 1;
    const subCategoryId = params?.id; // هنا الـ id يعبر عن subCategoryId

    // 2. جلب البيانات من السيرفر مباشرة
    const response = await conn.fetchProductsBySubCategory({ 
        subCategoryId: subCategoryId, 
        page: page 
    });

    // 3. معالجة البيانات (نفس منطق الاستخراج الذكي الذي كتبناه سابقاً)
    let paginator = {};
    
    // التحقق من شكل الاستجابة (سواء كانت مباشرة أو داخل data)
    if (response && response.current_page) {
        paginator = response;
    } else if (response && response.data) {
        paginator = response.data;
    }

    // 4. استخراج المصفوفة ومعلومات الصفحات
    const products = paginator.data || [];
    
    const paginationInfo = {
        currentPage: paginator.current_page || parseInt(page),
        lastPage: paginator.last_page || 1,
        total: paginator.total || 0
    };

    // 5. عرض المكون المشترك
    return (
        <ProductListClient 
            initialProducts={products} 
            paginationInfo={paginationInfo}
            categoryId={subCategoryId} // نمرر الـ ID (يمكن استخدامه للـ Breadcrumbs داخل المكون)
        />
    );
}