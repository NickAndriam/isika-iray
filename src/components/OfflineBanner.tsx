'use client';

import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function OfflineBanner() {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="bg-warning text-white px-4 py-2 text-center text-sm font-medium"
    >
      <div className="flex items-center justify-center gap-2">
        <WifiOff size={16} />
        <span>{t('offline')} - {t('retry')}</span>
      </div>
    </motion.div>
  );
}
