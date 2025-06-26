# 로컬 실행 가이드

## 빠른 시작

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/converter_saas.git
cd converter_saas/next-converter

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 접속
# http://localhost:3001
```

## 상세 설치 과정

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/converter_saas.git
cd converter_saas/next-converter
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 접속
```
http://localhost:3001
```

## 장점

- ✅ **완전 무료** - 사용 횟수 제한 없음
- ✅ **개인정보 보호** - 파일이 서버에 저장되지 않음
- ✅ **빠른 변환** - 최적화된 FFmpeg 설정
- ✅ **다양한 형식** - 비디오, 오디오, 이미지 모두 지원
- ✅ **간편한 사용** - 드래그 앤 드롭으로 쉽게 사용

## 단점

- 설치 과정 필요
- 외부 접근 설정 필요
- 로컬 환경에서만 사용 가능

## 문제 해결

### 포트 충돌 시
```bash
# 다른 포트로 실행
npm run dev -- -p 3002
```

### 권한 문제 시
```bash
# 관리자 권한으로 실행
sudo npm run dev
```

### 메모리 부족 시
```bash
# Node.js 메모리 제한 증가
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
``` 