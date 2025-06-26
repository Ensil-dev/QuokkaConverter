# 🎬 범용 파일 변환기 (Universal File Converter)

**무료로 사용할 수 있는 온라인 파일 변환 서비스입니다. 비디오, 오디오, 이미지 파일을 원하는 형식으로 쉽고 빠르게 변환할 수 있습니다.**

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![FFmpeg](https://img.shields.io/badge/FFmpeg-6.0-green?style=for-the-badge&logo=ffmpeg)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)

## 📋 목차

- [💡 왜 만들었나요?](#-왜-만들었나요)
- [✨ 주요 기능](#-주요-기능)
- [🎯 언제 사용하나요?](#-언제-사용하나요)
- [📖 사용법](#-사용법)
- [🎯 지원 형식](#-지원-형식)
- [🛠️ 설치 및 실행](#️-설치-및-실행)
- [🔧 API 문서](#-api-문서)
- [🤝 기여하기](#-기여하기)
- [📄 라이선스](#-라이선스)

## 💡 왜 만들었나요?

### "무료 횟수를 다 써서 유료 결제하라고 하더라구요..."

사이드프로젝트 시연영상을 GIF로 변환하려고 여러 온라인 변환 사이트를 돌아다녔는데, 무료 변환 횟수를 모두 사용하자마자 "유료 결제하세요!"라는 메시지가 나왔습니다.

그래서 직접 **FFmpeg 라이브러리**를 활용해서 **완전 무료**로 사용할 수 있는 파일 변환기를 만들었습니다.

### 🎯 **이 변환기의 장점**

- ✅ **완전 무료** - 사용 횟수 제한 없음
- ✅ **개인정보 보호** - 파일이 서버에 저장되지 않음
- ✅ **빠른 변환** - 최적화된 FFmpeg 설정
- ✅ **다양한 형식** - 비디오, 오디오, 이미지 모두 지원
- ✅ **간편한 사용** - 드래그 앤 드롭으로 쉽게 사용

## ✨ 주요 기능

### 🎬 **범용 파일 변환**

- **비디오**: MP4, AVI, MOV, MKV, WebM, GIF, FLV, WMV, M4V, 3GP
- **오디오**: MP3, WAV, FLAC, AAC, OGG, M4A, WMA, Opus
- **이미지**: JPG, PNG, BMP, GIF, TIFF, WebP

### 🎛️ **고급 변환 옵션**

- **비디오**: 해상도, 프레임레이트, 비트레이트, 품질 설정
- **오디오**: 샘플레이트, 채널, 비트레이트, 품질 설정
- **이미지**: 해상도, 품질 설정

### 🚀 **실시간 진행 상태**

- 변환 진행 상황 실시간 표시
- 단계별 진행 상태 피드백
- 로딩 스피너 및 애니메이션

### 📱 **반응형 디자인**

- 모바일, 태블릿, 데스크톱 최적화
- 직관적인 사용자 인터페이스
- 드래그 앤 드롭 지원

## 🎯 언제 사용하나요?

### 📹 **비디오 변환**

- **시연영상 GIF 변환** - 사이드프로젝트나 포트폴리오용
- **소셜미디어용 영상** - 인스타그램, 틱톡 등에 맞는 형식
- **압축 변환** - 용량이 큰 영상을 작게 만들기
- **호환성 변환** - 특정 기기나 플랫폼에 맞는 형식

### 🎵 **오디오 변환**

- **음악 파일 변환** - MP3, WAV, FLAC 등
- **팟캐스트 편집** - 다양한 오디오 형식 통합
- **압축 변환** - 용량 줄이기
- **품질 향상** - 저품질 오디오 개선

### 🖼️ **이미지 변환**

- **웹 최적화** - PNG를 WebP로 변환하여 로딩 속도 향상
- **압축 변환** - 용량이 큰 이미지 압축
- **형식 변환** - JPG, PNG, GIF 등
- **해상도 조정** - 다양한 크기로 변환

## 📖 사용법

### **1. 파일 업로드**

- "파일 업로드" 버튼을 클릭하거나 파일을 드래그 앤 드롭
- 지원되는 형식의 파일을 선택

### **2. 출력 형식 선택**

- 파일 타입에 따라 자동으로 필터링된 출력 형식 목록에서 선택
- 비디오, 오디오, 이미지 간 변환 지원

### **3. 변환 옵션 설정**

- **비디오**: 해상도, FPS, 비트레이트, 품질
- **오디오**: 샘플레이트, 채널, 품질
- **이미지**: 해상도, 품질

### **4. 변환 실행**

- "변환하기" 버튼 클릭
- 실시간 진행 상태 확인
- 변환 완료 후 자동 다운로드

## 🎯 지원 형식

### **입력 형식**

| 카테고리   | 형식                                         |
| ---------- | -------------------------------------------- |
| **비디오** | MP4, AVI, MOV, MKV, WebM, FLV, WMV, M4V, 3GP |
| **오디오** | MP3, WAV, FLAC, AAC, OGG, M4A, WMA, Opus     |
| **이미지** | JPG, JPEG, PNG, BMP, GIF, TIFF, WebP, SVG    |

### **출력 형식**

| 카테고리   | 형식                                              |
| ---------- | ------------------------------------------------- |
| **비디오** | MP4, AVI, MOV, MKV, WebM, GIF, FLV, WMV, M4V, 3GP |
| **오디오** | MP3, WAV, FLAC, AAC, OGG, M4A, WMA, Opus          |
| **이미지** | JPG, JPEG, PNG, BMP, GIF, TIFF, WebP              |

## 🛠️ 설치 및 실행

### **옵션 1: 로컬 실행 (비용 $0)**

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/converter_saas.git
cd converter_saas/next-converter

# 2. 한 번에 설치 및 실행
npm run setup && npm run run

# 3. 브라우저에서 접속
# http://localhost:3001
```

**장점**: 완전 무료, 제한 없음, 프라이버시 보호  
**단점**: 설치 과정 필요, 외부 접근 설정 필요

### **옵션 2: Vercel 배포 (비용 $0-500/월)**

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/converter_saas.git
cd converter_saas/next-converter

# 2. 의존성 설치
npm install

# 3. Vercel 배포
npx vercel --prod
```

**장점**: 간편한 사용, URL 공유 가능, 모바일 접근  
**단점**: 사용량에 따른 비용, 제한사항 존재

### **사전 요구사항**

- Node.js 18.0.0 이상
- npm 또는 yarn
- 최소 4GB RAM (로컬 실행 시)

### **상세 설치 과정 (로컬 실행)**

#### **1. 저장소 클론**

```bash
git clone https://github.com/yourusername/converter_saas.git
cd converter_saas/next-converter
```

#### **2. 의존성 설치**

```bash
npm install
```

#### **3. 개발 서버 실행**

```bash
npm run dev
```

#### **4. 브라우저에서 접속**

```text
http://localhost:3001
```

#### **5. 프로덕션 빌드**

```bash
npm run build
npm start
```

## 🔧 API 문서

### **POST /api/convert**

파일 변환을 실행합니다.

#### 요청

```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('outputFormat', 'mp4');
formData.append('resolution', '1920x1080');
formData.append('quality', '높음');

const response = await fetch('/api/convert', {
  method: 'POST',
  body: formData,
});
```

#### 응답

```javascript
// 성공: 변환된 파일 (blob)
const blob = await response.blob();

// 실패: JSON 오류 메시지
const error = await response.json();
```

### **GET /api/formats**

지원하는 파일 형식을 반환합니다.

#### 응답 예시

```json
{
  "video": {
    "input": ["mp4", "avi", "mov", ...],
    "output": ["mp4", "avi", "mov", ...]
  },
  "audio": {
    "input": ["mp3", "wav", "flac", ...],
    "output": ["mp3", "wav", "flac", ...]
  },
  "image": {
    "input": ["jpg", "png", "gif", ...],
    "output": ["jpg", "png", "gif", ...]
  }
}
```

## 🤝 기여하기

### **버그 리포트**

1. GitHub Issues에서 버그 리포트 생성
2. 상세한 재현 단계 포함
3. 브라우저 및 OS 정보 제공

### **기능 제안**

1. GitHub Discussions에서 제안
2. 사용 사례 및 요구사항 명시
3. 커뮤니티 피드백 수집

### **코드 기여**

1. Fork 후 브랜치 생성
2. 기능 개발 및 테스트
3. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

- **FFmpeg** - 강력한 미디어 변환 엔진
- **Next.js** - 현대적인 React 프레임워크
- **Vercel** - 서버리스 배포 플랫폼
- **커뮤니티** - 피드백과 기여

---

### ⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요

### 🔗 관련 링크

- [라이브 데모](https://your-demo-url.vercel.app)
- [기술 문서](https://your-docs-url.com)
- [변경 로그](CHANGELOG.md)
