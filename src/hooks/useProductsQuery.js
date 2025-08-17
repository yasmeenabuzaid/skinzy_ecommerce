import { useQuery } from '@tanstack/react-query';
import BackendConnector from '../services/connectors/BackendConnector';

const useProductsQuery = () => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: BackendConnector.fetchProducts,
    
    // 👇 هنا الحل: نقوم بمعالجة البيانات لتوحيد شكلها
    select: (responseData) => {
      // الحالة الأولى: إذا كانت البيانات مصفوفة مباشرة
      if (Array.isArray(responseData)) {
        return { products: responseData, groups: [] };
      }
      
      // الحالة الثانية (الافتراضية): إذا كانت البيانات كائنًا
      return {
        products: responseData?.products || [],
        groups: responseData?.groups || [],
      };
    },
  });

  return {
    // الآن `data` دائمًا يحتوي على products و groups
    products: data?.products || [],
    groups: data?.groups || [],
    isLoading,
    error,
  };
};

export default useProductsQuery;