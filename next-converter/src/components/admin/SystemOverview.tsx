'use client';

import { useTranslations } from 'next-intl';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}

function ProgressBar({ label, value, max, color, unit = '%' }: ProgressBarProps) {
  const percentage = (value / max) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-gray-600 dark:text-gray-400">
          {value}{unit} / {max}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function SystemOverview() {
  const t = useTranslations('Admin');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {t('systemOverview')}
        </h3>
        <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
          {t('healthy')}
        </span>
      </div>

      <div className="space-y-6">
        <ProgressBar
          label={t('cpuUsage')}
          value={34}
          max={100}
          color="bg-blue-500"
        />
        
        <ProgressBar
          label={t('memoryUsage')}
          value={67}
          max={100}
          color="bg-purple-500"
        />
        
        <ProgressBar
          label={t('diskSpace')}
          value={245}
          max={500}
          color="bg-orange-500"
          unit=" GB"
        />
        
        <ProgressBar
          label={t('networkBandwidth')}
          value={12}
          max={100}
          color="bg-green-500"
          unit=" Mbps"
        />
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('activeConnections')}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">1,247</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('lastRestart')}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">3d ago</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('serverVersion')}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">v2.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('environment')}</span>
            <span className="font-medium text-green-600 dark:text-green-400">Production</span>
          </div>
        </div>
      </div>
    </div>
  );
}