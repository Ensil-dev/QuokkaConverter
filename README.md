# QuokkaConverter 🚀

> **서버리스 기반의 고성능 파일 변환 플랫폼**

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://quokkaconverter.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)](https://webassembly.org/)
[![Jotai](https://img.shields.io/badge/Jotai-2.8-000000?style=for-the-badge)](https://jotai.org/)

---

## 📋 프로젝트 개요

**문제 상황**: 기존 파일 변환 서비스들의 높은 서버 비용과 보안 취약점  
**해결 방안**: WebAssembly 기반 클라이언트 변환 + 서버리스 아키텍처  
**비즈니스 임팩트**: 서버 운영 비용 **100% 절감**, 무제한 확장성 확보

### 🎯 핵심 성과

- **기술적 혁신**: ffmpeg.wasm을 활용한 서버리스 환경에서의 미디어 처리 구현
- **보안 강화**: Next.js 15 미들웨어 기반 인증 시스템으로 무단 접근 차단
- **성능 최적화**: 클라이언트 사이드 처리로 서버 부하 제로화
- **사용자 경험**: 직관적인 UI/UX로 변환 과정의 복잡성 추상화

---

## 🛠 기술적 도전과 해결

### 1. 서버리스 환경에서의 미디어 처리

**문제**: Vercel 등 서버리스 환경에서 FFmpeg 바이너리 실행 불가  
**해결**:

- WebAssembly 기반 `@ffmpeg/ffmpeg` 도입
- 클라이언트 사이드 변환으로 서버 의존성 제거
- SharedArrayBuffer 활용한 고성능 메모리 처리

```typescript
// 핵심 구현: WASM 기반 미디어 변환
const convertVideo = async (inputFile: File, options: ConvertOptions) => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  ffmpeg.writeFile('input.mp4', await fetchFile(inputFile));
  await ffmpeg.exec(['-i', 'input.mp4', ...buildArgs(options), 'output.webm']);

  const data = await ffmpeg.readFile('output.webm');
  return new Uint8Array(data);
};
```

### 2. Next.js 15 인증 미들웨어 구현

**문제**: 복잡한 라우팅 구조에서의 인증 처리  
**해결**:

- JWT 토큰 기반 미들웨어 구현
- NextAuth.js v5와 호환되는 보안 계층
- 파일 위치 이슈 해결 (`src/middleware.js`)

```javascript
// 핵심 구현: 인증 미들웨어
export async function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/convert')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}
```

### 3. 대용량 파일 처리 최적화

**문제**: 브라우저 메모리 제한과 변환 성능  
**해결**:

- Streaming 기반 파일 처리
- Web Workers를 통한 메인 스레드 차단 방지
- 진행률 추적과 메모리 관리

---

## 🏗 아키텍처 설계

### 시스템 아키텍처

```table
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Serverless    │    │   External      │
│                 │    │                 │    │                 │
│ • React 19      │───▶│ • Next.js 15    │───▶│ • Google OAuth  │
│ • ffmpeg.wasm   │    │ • NextAuth.js   │    │ • Vercel Edge   │
│ • TypeScript    │    │ • Edge Runtime  │    │ • CloudFront    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 데이터 플로우

1. **인증**: Google OAuth → JWT 토큰 발급
2. **업로드**: 클라이언트 메모리 직접 로딩
3. **변환**: WebAssembly 엔진 처리
4. **다운로드**: Blob URL 직접 제공

---

## 💼 비즈니스 임팩트

### 운영 비용 최적화

- **서버 비용**: $0/월 (기존 대비 100% 절감)
- **CDN 비용**: 정적 리소스만 사용으로 최소화
- **확장성**: 사용자 증가에 따른 추가 비용 없음

### 기술 부채 관리

- **테스트 커버리지**: Jest + Testing Library 도입
- **코드 품질**: ESLint + Prettier 자동화
- **타입 안전성**: TypeScript strict mode

### 보안 강화

- **인증**: OAuth 2.0 표준 준수
- **인가**: 이메일 화이트리스트 기반 접근 제어
- **데이터 보호**: 클라이언트 처리로 서버 저장 없음

---

## 🔧 기술 스택

### Core Technologies

- **Frontend**: Next.js 15.3.4, React 19.0.0, TypeScript 5
- **Authentication**: NextAuth.js 5.0.0-beta.29 (Google OAuth)
- **Media Processing**: @ffmpeg/ffmpeg 0.12.15, @ffmpeg/util 0.12.2
- **PDF Processing**: pdf-lib 1.17.1

### Development & Testing

- **Testing**: Jest 29.7.0, Testing Library
- **Code Quality**: ESLint 9, Prettier 3.6.2
- **Bundling**: Next.js built-in Webpack 5
- **State Management**: Jotai 2.8.3

### Infrastructure & Deployment

- **Hosting**: Vercel (Edge Functions + Static Generation)
- **CDN**: CloudFront for WebAssembly files
- **Analytics**: Vercel Analytics integration

---

## 📊 성능 지표

### 변환 성능

- **비디오**: 1080p/60fps → 720p/30fps (90초 영상 약 45초)
- **오디오**: MP3 320kbps → 128kbps (5MB 파일 약 8초)
- **이미지**: 4K PNG → WebP (20MB → 2MB, 3초)
- **PDF**: 10페이지 문서 병합 (2초)

### 사용자 경험

- **첫 로딩**: < 2초 (Static Generation)
- **변환 시작**: < 1초 (WASM 로딩 캐시)
- **모바일 최적화**: 터치 인터페이스, 반응형 디자인

---

## 🚀 주요 기능

### 📹 **비디오 변환**

- 지원 포맷: MP4, AVI, MOV, MKV, WebM
- 해상도 조정: 480p ~ 1080p
- FPS 제어: 24 ~ 60fps
- 품질/비트레이트 최적화

### 🎵 **오디오 변환**

- 지원 포맷: MP3, WAV, FLAC, AAC, OGG
- 샘플레이트: 22kHz ~ 48kHz
- 채널: 모노/스테레오 선택

### 🖼️ **이미지 처리**

- 포맷 변환: JPG, PNG, WebP, TIFF
- GIF 생성: 다중 이미지 합성
- 해상도/품질 조정

### 📑 **PDF 처리**

- 이미지 → PDF 변환
- 문서 병합/분할
- 메타데이터 관리

---

## 📱 UX/UI 특화 기능

### 모바일 최적화

- **뒤로가기 방지**: 변환 중 실수 종료 방지
- **인앱 브라우저 감지**: KakaoTalk/LINE에서 외부 브라우저 유도
- **터치 최적화**: 드래그 앤 드롭, 스와이프 제스처

### 사용자 가이드

- **실시간 미리보기**: 변환 옵션 적용 결과 예측
- **진행률 표시**: 변환 단계별 상태 표시
- **에러 핸들링**: 사용자 친화적 오류 메시지

---

## 🔒 보안 및 인증

### OAuth 2.0 구현

```typescript
// 보안 강화된 NextAuth 설정
export const { auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(',') || [];
      return allowedEmails.includes(user.email!);
    },
  },
});
```

### 미들웨어 보안 계층

- JWT 토큰 검증
- 라우트별 접근 제어
- CSRF 방지

---

## 📦 설치 및 실행

### Quick Start

```bash
git clone https://github.com/your-repo/QuokkaConverter.git
cd QuokkaConverter/next-converter
npm install
cp env.example .env.local
npm run dev
```

### 환경변수 설정

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ALLOWED_EMAILS=admin@example.com,user@example.com
NEXT_PUBLIC_FFMPEG_BASE_URL=https://your-cdn.com
```

### 배포 (Vercel)

```bash
vercel --prod
# 환경변수는 Vercel Dashboard에서 설정
```

---

## 🧪 테스트 및 품질 관리

### 테스트 커버리지

```bash
npm run test              # 단위 테스트
npm run test:coverage     # 커버리지 리포트
npm run lint              # 코드 품질 검사
npm run build             # 프로덕션 빌드 검증
```

### 주요 테스트 시나리오

- 파일 업로드/변환 플로우
- 인증/인가 로직
- 에러 핸들링
- 크로스 브라우저 호환성

---

## 📈 향후 개선 계획

### 기술적 확장

- [ ] Web Workers 병렬 처리 최적화
- [ ] WebCodecs API 활용한 하드웨어 가속

### 비즈니스 확장

- [ ] 사용량 분석 대시보드
- [ ] API 서비스 제공
- [ ] 엔터프라이즈 버전 개발

---

**Portfolio Repository**: [GitHub](https://github.com/Ensil-dev/QuokkaConverter)  
**Live Demo**: [quokkaconverter.vercel.app](https://quokkaconverter.vercel.app/)  
**Contact**: <dlwjd164@gmail.com>
