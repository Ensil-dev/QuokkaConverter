import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // URL의 [locale] 세그먼트에 해당하는 요청된 로케일
  const requested = await requestLocale;
  
  // 요청된 로케일이 지원되는지 확인하고, 지원되지 않으면 기본 로케일 사용
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // 해당 로케일의 메시지 파일을 동적으로 로드
    messages: (await import(`../../messages/${locale}.json`)).default,
    // 시간대 설정 (선택사항)
    timeZone: 'Asia/Seoul',
    // 날짜/시간 기준점 (선택사항, 정적 렌더링을 위해)
    now: new Date()
  };
});