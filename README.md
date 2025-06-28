# QuokkaConverter

로컬에서 무제한으로 사용가능한 범용 파일 변환 서비스입니다.

## 소개

**QuokkaConverter**는 비디오, 오디오, 이미지 등 다양한 파일을 쉽고 빠르게 원하는 형식으로 변환할 수 있는 SaaS 서비스입니다. Google OAuth 기반 인증, 클라이언트 사이드 FFmpeg(wasm) 변환, 직관적인 UI/UX, 다양한 변환 옵션, 예상 크기/시간 미리보기, 강력한 보안과 비용 최적화까지 모두 갖추었습니다.

## 주요 기능
- 다양한 포맷(MP4, MOV, GIF, PNG, WebP, MP3, WAV 등) 상호 변환
- Google 계정 로그인(OAuth, 허용 이메일 제한)
- 클라이언트 사이드 FFmpeg(wasm) 기반 변환 (Vercel 등 서버리스 환경 최적화)
- 변환 옵션: 해상도, 프레임레이트, 품질, 비트레이트, 재생속도, 오디오/이미지 세부 옵션 등
- 변환 예상 크기/시간/출력 미리보기
- 직관적이고 현대적인 UI/UX (Tailwind, 다크모드, 반응형, 쿼카 테마)
- 사용량 기록, 인증 미들웨어, 보안 강화
- 비용 최적화: 서버리스, wasm, 대용량 파일 제한, 효율적 변환

## 로컬 실행 방법
1. 저장소 클론 및 의존성 설치
2. Google OAuth 클라이언트 등록 및 환경변수 설정
3. `next-converter` 디렉토리에서 개발 서버 실행

```bash
cd next-converter
npm install
cp env.example .env.local # 환경변수 설정
npm run dev
```

## 환경변수 예시
- `.env.local`에 Google OAuth, 허용 이메일 등 설정

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
ALLOWED_EMAILS=your@email.com,another@email.com
```

## 비용 이슈 및 최적화 방안
- 서버리스 환경(Vercel)에서 FFmpeg 설치 불가 → ffmpeg.wasm으로 대체
- 대용량 파일 제한(100MB), 변환 옵션별 예상 크기/시간 안내
- 사용량 기록, 인증 제한으로 남용 방지
- WebP 등 고효율 포맷 권장

## 사용자 가치
- 누구나 쉽고 빠르게 다양한 파일 변환 가능
- 쿼카처럼 친근한 UI/UX와 강력한 기능
- Google 계정 기반 안전한 접근
- 무료/저비용으로 서버리스 환경에서 운영 가능

---

QuokkaConverter와 함께 쉽게 파일을 변환하세요! 🦘🐨
