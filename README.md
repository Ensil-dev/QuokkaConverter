# QuokkaConverter 🐻

**Next.js 15 기반 서버리스 파일 변환 SaaS**  
브라우저에서 **비디오·오디오·이미지·PDF·GIF**를 직접 변환하여 서버 비용 없이 안정적이고 빠른 서비스를 제공합니다.

👉 [Live Demo 바로가기](https://quokkaconverter.vercel.app/)

---

## 목차

1. [소개](#소개)  
2. [주요 기능](#주요-기능)  
3. [설치 및 실행](#설치-및-실행)  
4. [환경변수 설정](#환경변수-설정)  
5. [기술 스택](#기술-스택)  
6. [스크린샷 & 데모 GIF](#스크린샷--데모-gif)  
7. [비용 최적화](#비용-최적화)  
8. [성과 및 사용자 가치](#성과-및-사용자-가치)  
9. [프로젝트 진행 방식](#프로젝트-진행-방식)  

---

## 소개

**QuokkaConverter**는 다양한 파일을 쉽고 빠르게 변환할 수 있는 **범용 SaaS 서비스**입니다.

- Google OAuth 기반 인증 및 이메일 화이트리스트 관리  
- ffmpeg.wasm 기반 클라이언트 사이드 변환 (서버리스 환경 최적화)  
- 직관적 UI/UX와 다양한 변환 옵션  
- 예상 크기/시간 미리보기, 사용량 기록, 보안 강화  
- 서버 비용 절감을 위한 최적화된 아키텍처  

---

## 주요 기능

### 🔐 보안 및 접근 제어
- Google OAuth 로그인  
- 허용된 이메일만 접근 가능 (**Vercel Edge Config** 관리)  
- 인증 미들웨어로 API 보호, 무단 접근 차단  

### 🎥 비디오 변환
- **지원 형식**: MP4, AVI, MOV, MKV, WebM, GIF 등  
- **옵션**: 해상도(~1080p), FPS(~60), 비트레이트, 재생속도, 품질  

### 🎵 오디오 변환
- **지원 형식**: MP3, WAV, FLAC, AAC, OGG 등  
- **옵션**: 샘플레이트(22k/44k/48k), 모노/스테레오, 품질 설정  

### 🖼️ 이미지 변환
- **지원 형식**: JPG, PNG, BMP, GIF, TIFF, WebP  
- 해상도·품질 조정, PDF 변환 지원  
- 여러 이미지를 합쳐 GIF 생성 (자동 크기 조정, 색상 팔레트 최적화)  

### 📑 PDF 처리
- 이미지 → PDF 변환  
- PDF 병합, 특정 페이지 분할  
- **pdf-lib** 기반, 예상 크기/시간 표시  

### 🧩 UX & 기타 기능
- 변환 예상 크기·시간 계산 및 진행률 표시  
- 모바일: 뒤로가기 두 번 시 종료 토스트  
- 인앱 브라우저(KakaoTalk·LINE) 감지 후 외부 브라우저 리디렉션  

---

## 설치 및 실행

```bash
git clone <repository-url>
cd next-converter
npm install
cp env.example .env.local
npm run dev
```

---

## 환경변수 설정

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ALLOWED_EMAILS=admin1@gmail.com
EDGE_CONFIG=https://edge-config.vercel.com/your-id?token=your-token
EDGE_CONFIG_ID=your-edge-config-id
EDGE_CONFIG_TOKEN=your-edge-config-token
```

---

## 배포 가이드

### Vercel 배포

1. **vercel CLI로 프로젝트 생성 및 배포**
2. **Vercel 대시보드에서 환경변수 설정**
3. **Google OAuth 리디렉션 URI에 등록**:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```

---

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Auth**: NextAuth.js v5, Google OAuth
- **Multimedia**: ffmpeg.wasm, pdf-lib
- **Infra**: Vercel Edge Config (이메일 제어), Vercel 배포
- **Test**: Jest

---

## 스크린샷 & 데모 GIF

*(아래 항목별로 GIF/이미지 삽입)*

- Google OAuth 로그인 & 접근 제한 흐름
- 관리자 페이지 – 이메일 관리(추가/삭제/조회)
- 비디오 변환 – 해상도/FPS 옵션 적용 예시
- 오디오 변환 – 샘플레이트 & 품질 설정
- 이미지 변환 – JPG ↔ PNG 변환
- GIF 생성 – 여러 이미지 합성 & 미리보기
- PDF 변환 – 이미지 → PDF
- PDF 병합 & 분할
- 모바일 UX – 뒤로가기 종료 토스트
- 인앱 브라우저 감지 & 리디렉션

---

## 비용 최적화

- 서버리스 한계(FFmpeg 설치 불가) → **ffmpeg.wasm** 대체
- 파일 크기 제한(100MB), 변환 시간 제한(5분)
- 사용량 기록 + 인증 제한으로 남용 방지
- WebP 등 고효율 포맷 권장
- 동일 변환 결과 캐싱 및 CDN 활용으로 대역폭 절감

---

## 성과 및 사용자 가치

- **서버리스 아키텍처**로 비용 절감 + 확장성 확보
- **클라이언트 사이드 변환**으로 무제한 사용성 보장
- **OAuth + Edge Config**으로 보안성과 운영 편의성 강화
- **Jest 기반 테스트**로 안정적 유지보수성 확보
- **직관적인 UI/UX**로 누구나 쉽게 다양한 포맷 변환 가능

---

## 프로젝트 진행 방식

- **기획 → 설계 → 개발 → 테스트 → 배포** 전 과정 직접 수행
- 단순 기능 구현을 넘어, **비용·보안·UX**까지 고려한 **SaaS 아키텍처** 설계

---

## 기여하기

이슈 등록 및 Pull Request는 언제나 환영합니다!
