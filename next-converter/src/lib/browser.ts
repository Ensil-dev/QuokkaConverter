export function isInAppBrowser(): boolean {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    return (
        ua.includes('kakaotalk') ||
        ua.includes('naver') ||
        ua.includes('fbav') ||
        ua.includes('instagram')
    );
}

export function redirectToExternalBrowser(): void {
    alert('카카오톡 등 인앱 브라우저에서는 서비스가 정상적으로 동작하지 않을 수 있어 외부 브라우저로 이동합니다.');

    const url = 'www.quokkaconverter.com';
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';

    if (ua.includes('iphone') || ua.includes('ipad')) {
        window.location.href = `x-web-search://${url}`;
    } else {
        window.location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
    }
}
