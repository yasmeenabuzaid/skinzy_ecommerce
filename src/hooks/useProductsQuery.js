import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

const useProductsQuery = () => {
    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['products'],

        queryFn: async () => {
            const res = await BackendConnector.fetchProducts();
            return res;
        },

        // ⭐️ معالجة البيانات لتوحيد شكلها وإضافة رابط الصورة الكامل
        select: (responseData) => {

            // دالة مساعدة لمعالجة مصفوفة المنتجات وإضافة رابط الصورة
            const processProducts = (productsArray) => {
                return productsArray.map(product => {
                    return {
                        ...product,
                        // إضافة رابط Cloudinary الكامل (والذي أصبح مخزناً في قاعدة البيانات)
                        full_image_url: product.first_image?.image || null, 
                    };
                });
            };

            // الحالة الأولى: لو كانت البيانات عبارة عن مصفوفة مباشرة (ليست Paginated)
            if (Array.isArray(responseData)) {
                const productsWithUrls = processProducts(responseData);
                return { products: productsWithUrls, groups: [] };
            }
            
            // الحالة الثانية: Paginated Data (المنتجات داخل خاصية 'data')
            const products = responseData?.data || [];
            const productsWithUrls = processProducts(products); // معالجة المنتجات هنا

            return {
                products: productsWithUrls,
                groups: responseData?.groups || [], // افترض أن المجموعات قد تأتي من مكان آخر
            };
        },
    });


    return {
        products: data?.products || [],
        groups: data?.groups || [],
        isLoading,
        error,
    };
};

export default useProductsQuery;