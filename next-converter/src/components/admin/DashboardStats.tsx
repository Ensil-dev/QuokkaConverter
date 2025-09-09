'use client';

import { useTranslations } from 'next-intl';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, changeType, icon, color }: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }[changeType];

  const changeIcon = {
    positive: '↗',
    negative: '↘',
    neutral: '→'
  }[changeType];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
          </div>
        </div>
        <div className={`text-sm font-medium ${changeColor} flex items-center gap-1`}>
          <span>{changeIcon}</span>
          {change}
        </div>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  const t = useTranslations('Admin');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


      <StatCard
        title={t('systemUptime')}
        value="99.9%"
        change="stable"
        changeType="neutral"
        color="bg-orange-100 dark:bg-orange-900/30"
        icon={
          <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />
    </div>
  );
}