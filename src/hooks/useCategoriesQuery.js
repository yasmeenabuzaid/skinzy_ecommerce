import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

const useCategoryQuery = () => {
  const {
    data: categories = [],        
    isLoading: isLoadingCategories, 
    error: errorCategories,         
  } = useQuery({
    queryKey: ['categories'],
    queryFn: BackendConnector.fetchCategories,
    select: (result) => {
      if (Array.isArray(result)) {
        return result;
      }
      // يفترض أن التصنيفات تأتي داخل خاصية 'categories' أو 'data'
      return result?.categories || result?.data || [];
    },
    // ⭐️ إضافة هذا الخيار لجعل الكاش يعمل حتى لو كان المستخدم في وضع عدم الاتصال
    staleTime: 60 * 60 * 1000, // مثلاً، ساعة واحدة
    cacheTime: 24 * 60 * 60 * 1000, // يوم كامل
  });

  return { categories, isLoadingCategories, errorCategories };
};

export default useCategoryQuery;