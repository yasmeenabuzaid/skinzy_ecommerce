'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const PageTransitionWrapper = ({ children }) => {
  const pathname = usePathname();

  return (
    // AnimatePresence ضروري لعمل تأثيرات الخروج
    // وضع "wait" يضمن أن الصفحة القديمة تختفي تماماً قبل ظهور الجديدة
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // المفتاح هنا ضروري جداً ليعرف المكون أن الصفحة تغيرت
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionWrapper;
