import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

const useCategoryQuery = () => {
  const {
    data: categories = [], // 1. `data` هو نتيجة الـ fetch، ونعطيه اسم categories وقيمة افتراضية
    isLoading: isLoadingCategories, // 2. `isLoading` جاهزة من المكتبة
    error: errorCategories, // 3. `error` جاهز أيضًا
  } = useQuery({
    // 4. مفتاح فريد لتعريف هذا النوع من البيانات في الـ cache
    queryKey: ['subCategories'], 
    
    // 5. الدالة التي ستقوم بجلب البيانات
    queryFn: BackendConnector.fetchSubCategories,

    // 6. (اختياري لكن مفيد) لتنسيق البيانات القادمة من الـ API
    select: (result) => {
      if (Array.isArray(result)) {
        return result;
      }
      // إذا لم يكن الطلب ناجحًا، المكتبة ستتعامل مع الخطأ تلقائيًا
      // لذلك نهتم فقط بحالة النجاح هنا
      return result?.categories || [];
    },
  });

  return { categories, isLoadingCategories, errorCategories };
};

export default useCategoryQuery;