'use client';

import { useTranslations } from 'next-intl';

interface ActivityItem {
  id: string;
  type: 'conversion' | 'user' | 'system' | 'error';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'conversion',
    message: 'Large batch conversion completed (247 files)',
    timestamp: '2 minutes ago',
    severity: 'low'
  },
  {
    id: '2', 
    type: 'user',
    message: 'New user registration: john@example.com',
    timestamp: '5 minutes ago',
    severity: 'low'
  },
  {
    id: '3',
    type: 'system',
    message: 'Database backup completed successfully',
    timestamp: '12 minutes ago',
    severity: 'low'
  },
  {
    id: '4',
    type: 'error',
    message: 'FFmpeg processing timeout (auto-recovered)',
    timestamp: '18 minutes ago',
    severity: 'medium'
  },
  {
    id: '5',
    type: 'conversion',
    message: 'PDF merger processed 45 documents',
    timestamp: '25 minutes ago',
    severity: 'low'
  }
];

function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
  const configs = {
    conversion: {
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    user: {
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    system: {
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    error: {
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const config = configs[type];
  
  return (
    <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center ${config.color}`}>
      {config.icon}
    </div>
  );
}

export default function RecentActivity() {
  const t = useTranslations('Admin');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t('recentActivity')}
        </h3>
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          {t('viewAll')}
        </button>
      </div>

      <div className="space-y-4">
        {mockActivities.map((activity, index) => (
          <div 
            key={activity.id}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
              index !== mockActivities.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
            }`}
          >
            <ActivityIcon type={activity.type} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {activity.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {activity.timestamp}
              </p>
            </div>
            {activity.severity !== 'low' && (
              <div className={`w-2 h-2 rounded-full ${
                activity.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          {t('loadMore')}
        </button>
      </div>
    </div>
  );
}