# 범용 파일 변환 SaaS

비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하는 Next.js 기반 SaaS 애플리케이션입니다.

## ✨ 주요 기능

### 🔐 보안 및 접근 제어

- **OAuth 로그인**: Google 계정으로 안전한 인증
- **허용된 사용자 관리**: 특정 이메일 주소만 접근 가능
- **API 보호**: 인증된 사용자만 변환 기능 사용 가능
- **비용 제어**: 무제한 사용 방지로 서버 비용 관리

### 🎥 비디오 변환

- **지원 형식**: MP4, AVI, MOV, MKV, WebM, GIF, FLV, WMV, M4V, 3GP
- **재생속도 조절**: 0.25x ~ 2.0x (GIF 변환 시)
- **해상도 조정**: 640x360, 1280x720, 1920x1080
- **프레임레이트**: 1-60 FPS
- **비트레이트**: 1000k, 2000k, 5000k
- **품질 설정**: 낮음, 보통, 높음

### 🎵 오디오 변환

- **지원 형식**: MP3, WAV, FLAC, AAC, OGG, M4A, WMA, OPUS
- **샘플레이트**: 22050, 44100, 48000 Hz
- **채널**: 모노, 스테레오
- **품질 설정**: 낮음, 보통, 높음

### 🖼️ 이미지 변환

- **지원 형식**: JPG, PNG, BMP, GIF, TIFF, WebP
- **해상도 조정**: 800x600, 1024x768, 1920x1080
- **품질 설정**: 낮음, 보통, 높음
- **PDF 변환 기능은 JPG/PNG 이미지만 지원**
- **여러 이미지를 선택해 하나의 GIF로 변환** (FFmpeg WASM 기반으로 정상 동작)
- **서로 다른 크기의 이미지를 합칠 때 자동으로 크기를 맞춤**
- **GIF 생성 시 내부적으로 WebP 포맷을 사용하며 품질에 따라 색상 팔레트를 최적화**

### 🚀 성능 최적화

- **FFmpeg 최적화**: 멀티스레딩, 메모리 버퍼, 타임아웃 설정
- **실시간 예측**: 파일 크기, 변환 시간 미리 계산
- **진행 상태 표시**: 변환 진행률 실시간 업데이트
- **에러 처리**: 구체적인 오류 메시지와 해결 방안

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **인증**: NextAuth.js v5, Google OAuth
- **파일 처리**: FFmpeg (ffmpeg-static)
- **스타일링**: CSS3, 반응형 디자인
- **배포**: Vercel (서버리스)

## 📦 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd next-converter
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth 설정
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 허용된 사용자 이메일 목록 (쉼표로 구분)
ALLOWED_EMAILS=user1@gmail.com,user2@gmail.com

# 개발 모드에서는 모든 사용자 허용 (빈 값으로 설정)
# ALLOWED_EMAILS=
```

### 4. Google OAuth 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI에 `http://localhost:3000/api/auth/callback/google` 추가
4. 클라이언트 ID와 시크릿을 환경변수에 설정

### 5. 개발 서버 실행

```bash
npm run dev
```

## 🌐 배포 (Vercel)

### 1. Vercel 프로젝트 생성

```bash
npm install -g vercel
vercel
```

### 2. 환경변수 설정

Vercel 대시보드에서 다음 환경변수를 설정하세요:

- `NEXTAUTH_URL`: 배포된 URL
- `NEXTAUTH_SECRET`: 랜덤 시크릿 키
- `GOOGLE_CLIENT_ID`: Google OAuth 클라이언트 ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth 클라이언트 시크릿
- `ALLOWED_EMAILS`: 허용된 사용자 이메일 (쉼표로 구분)

### 3. Google OAuth 리디렉션 URI 업데이트

배포된 URL의 콜백 주소를 Google Cloud Console에 추가:
`https://your-domain.vercel.app/api/auth/callback/google`

## 🔧 설정 옵션

### 허용된 사용자 관리

- `ALLOWED_EMAILS` 환경변수에 쉼표로 구분된 이메일 목록 설정
- 빈 값으로 설정하면 모든 사용자 허용 (개발용)
- 프로덕션에서는 반드시 허용된 이메일만 설정

### 파일 크기 제한

- 기본: 100MB
- `MAX_FILE_SIZE` 환경변수로 조정 가능

### 변환 시간 제한

- 기본: 5분
- `MAX_CONVERSION_TIME` 환경변수로 조정 가능

## 💰 비용 최적화

### Vercel 배포 시 주의사항

- **함수 실행 시간**: 10초 (Hobby), 60초 (Pro), 900초 (Enterprise)
- **함수 호출 수**: 월 100,000회 (Hobby), 1,000,000회 (Pro)
- **대역폭**: 월 100GB (Hobby), 1TB (Pro)

### 비용 절약 팁

1. **파일 크기 제한**: 100MB 이하로 제한
2. **변환 시간 제한**: 5분 이하로 설정
3. **허용된 사용자 관리**: OAuth로 무제한 사용 방지
4. **캐싱 활용**: 동일한 변환 결과 재사용
5. **CDN 활용**: Vercel Edge Network 활용

## 🚨 문제 해결

### 일반적인 오류

1. **"인증이 필요합니다"**: 로그인 후 다시 시도
2. **"접근 권한이 없습니다"**: 관리자에게 이메일 등록 요청
3. **"변환 시간이 초과되었습니다"**: 더 작은 파일로 시도
4. **"지원하지 않는 형식입니다"**: 지원되는 형식 확인

### 개발 모드에서 모든 사용자 허용

```env
ALLOWED_EMAILS=
```

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 기능 요청이 있으시면 이슈를 생성해주세요.
