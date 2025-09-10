# QuokkaConverter UI Components

Linear.app에서 영감을 받은 다크 테마 디자인 시스템 컴포넌트들입니다.

## 설치 및 사용

### 기본 사용법

```tsx
import { 
  Button, 
  Card, 
  Input, 
  Typography, 
  Carousel, 
  Navbar, 
  Footer, 
  Hero,
  FileUpload,
  LoadingSpinner,
  Alert,
  TabNavigation,
  SegmentedControl,
  FormatSelector,
  PlaybackSpeedControl,
  VideoSettings,
  AudioSettings,
  ImageSettings,
  ConversionInfo,
  ConversionResult,
  ModeSelector
} from '@/components/ui';

function MyComponent() {
  return (
    <div>
      <Navbar 
        logoText="Brand"
        items={navItems}
        rightContent={<Button variant="primary">로그인</Button>}
      />
      <Hero
        title="환영합니다"
        description="멋진 경험을 시작하세요"
        actions={heroActions}
      />
      <Card>
        <Typography variant="h2">제목</Typography>
        <Input label="이메일" placeholder="이메일을 입력하세요" />
        <Button variant="primary">제출</Button>
        <Carousel 
          items={carouselItems}
          autoPlay={true}
          showDots={true}
        />
      </Card>
      <Footer 
        logoText="Brand"
        sections={footerSections}
        copyright="© 2024"
      />
    </div>
  );
}
```

## 컴포넌트 목록

### Button

- `variant`: 'primary' | 'ghost' (기본값: 'primary')
- `size`: 'sm' | 'md' | 'lg' (기본값: 'md')

```tsx
<Button variant="primary" size="md">기본 버튼</Button>
<Button variant="ghost" size="lg">고스트 버튼</Button>
```

### Card

- `glass`: boolean - glassmorphism 효과 적용
- `padding`: 'none' | 'sm' | 'md' | 'lg' | 'xl' (기본값: 'md')
- `image`: string - 이미지 URL
- `imageAlt`: string - 이미지 alt 텍스트
- `imageHeight`: string - 이미지 높이 (기본값: '200px')
- `imagePosition`: 'top' | 'bottom' | 'left' | 'right' - 이미지 위치

```tsx
<Card>기본 카드</Card>
<Card glass>글래스 효과 카드</Card>
<Card padding="lg">큰 패딩 카드</Card>
<Card 
  image="image-url"
  imagePosition="top"
  imageHeight="180px"
>
  이미지 카드
</Card>
```

### Carousel

- `items`: CarouselItem[] - 캐러셀 아이템 배열
- `autoPlay`: boolean - 자동 재생 여부 (기본값: false)
- `autoPlayInterval`: number - 자동 재생 간격 (기본값: 3000ms)
- `showDots`: boolean - 도트 표시 여부 (기본값: true)
- `showArrows`: boolean - 화살표 표시 여부 (기본값: true)
- `infinite`: boolean - 무한 반복 여부 (기본값: true)

```tsx
<Carousel
  items={[
    {
      id: '1',
      content: <div>슬라이드 콘텐츠</div>
    }
  ]}
  autoPlay={true}
  autoPlayInterval={4000}
  showDots={true}
  showArrows={true}
/>
```

### Input

- `error`: boolean - 에러 상태
- `label`: string - 라벨 텍스트
- `helperText`: string - 도움말 텍스트

```tsx
<Input label="이메일" placeholder="이메일 입력" />
<Input error helperText="유효하지 않은 이메일" />
```

### Typography

- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small'
- `color`: 'primary' | 'secondary' | 'tertiary' | 'quaternary'
- `as`: HTML 엘리먼트 타입 (선택사항)

```tsx
<Typography variant="h1" color="primary">제목</Typography>
<Typography variant="body" color="secondary">본문</Typography>
<Typography variant="caption" as="span">캡션</Typography>
```

### Hero

- `title`: string - 메인 제목 (필수)
- `subtitle`: string - 부제목 (선택사항)
- `description`: string - 설명 텍스트
- `actions`: HeroAction[] - 액션 버튼 배열
- `backgroundImage`: string - 배경 이미지 URL
- `backgroundVideo`: string - 배경 비디오 URL
- `overlay`: boolean - 오버레이 표시 여부 (기본값: true)
- `overlayOpacity`: number - 오버레이 투명도 (기본값: 0.6)
- `centerContent`: boolean - 콘텐츠 중앙 정렬 여부 (기본값: true)
- `size`: 'sm' | 'md' | 'lg' | 'xl' - 히어로 섹션 크기

```tsx
<Hero
  subtitle="부제목"
  title="메인 제목"
  description="설명 텍스트"
  size="lg"
  backgroundImage="image-url"
  overlay={true}
  actions={[
    {
      id: 'cta',
      label: '시작하기',
      variant: 'primary'
    }
  ]}
/>
```

### Navbar

- `logoText`: string - 로고 텍스트 (기본값: 'Brand')
- `logo`: React.ReactNode - 커스텀 로고 컴포넌트
- `items`: NavItem[] - 네비게이션 메뉴 아이템
- `rightContent`: React.ReactNode - 우측에 표시할 콘텐츠
- `sticky`: boolean - 고정 위치 여부 (기본값: true)
- `transparent`: boolean - 투명 배경 여부 (기본값: false)

```tsx
<Navbar
  logoText="Brand"
  items={[
    { id: 'home', label: '홈', active: true },
    { id: 'about', label: '소개' }
  ]}
  rightContent={
    <Button variant="primary">로그인</Button>
  }
  sticky={true}
  transparent={false}
/>
```

### Footer

- `logoText`: string - 로고 텍스트 (기본값: 'Brand')
- `logo`: React.ReactNode - 커스텀 로고 컴포넌트
- `description`: string - 브랜드 설명
- `sections`: FooterSection[] - 링크 섹션 배열
- `socialLinks`: FooterLink[] - 소셜 링크 배열
- `copyright`: string - 저작권 텍스트
- `minimal`: boolean - 미니멀 모드 여부 (기본값: false)

```tsx
<Footer
  logoText="Brand"
  description="서비스 설명"
  sections={[
    {
      id: 'product',
      title: '제품',
      links: [
        { id: 'feature1', label: '기능 1' }
      ]
    }
  ]}
  socialLinks={[
    { id: 'twitter', label: '𝕏' }
  ]}
  copyright="© 2024 Brand."
  minimal={false}
/>
```

### FileUpload

- `accept`: string - 허용할 파일 형식 (예: ".jpg,.png,.pdf")
- `multiple`: boolean - 여러 파일 선택 허용 여부 (기본값: false)
- `maxSize`: number - 최대 파일 크기 (bytes)
- `maxFiles`: number - 최대 파일 개수 (기본값: 10)
- `variant`: 'dropzone' | 'button' - UI 변형 (기본값: 'dropzone')
- `showPreview`: boolean - 파일 미리보기 표시 여부 (기본값: true)
- `onFilesSelect`: (files: File[]) => void - 파일 선택 시 콜백
- `onError`: (error: string) => void - 에러 발생 시 콜백

```tsx
<FileUpload
  accept=".jpg,.png,.gif"
  multiple={true}
  maxSize={5 * 1024 * 1024}
  variant="dropzone"
  onFilesSelect={handleFiles}
  onError={handleError}
/>
```

### LoadingSpinner

- `size`: 'sm' | 'md' | 'lg' | 'xl' - 스피너 크기 (기본값: 'md')
- `color`: 'primary' | 'secondary' | 'accent' - 색상 (기본값: 'accent')
- `text`: string - 표시할 텍스트
- `fullScreen`: boolean - 전체 화면 모드 (기본값: false)
- `overlay`: boolean - 오버레이 배경 표시 (기본값: false)

```tsx
<LoadingSpinner size="lg" text="로딩 중..." />
<LoadingSpinner fullScreen overlay text="처리 중..." />
```

### Alert

- `variant`: 'info' | 'success' | 'warning' | 'error' - 알림 유형 (기본값: 'info')
- `title`: string - 알림 제목
- `message`: string - 알림 메시지 (필수)
- `dismissible`: boolean - 닫기 버튼 표시 여부 (기본값: false)
- `onDismiss`: () => void - 닫기 시 콜백
- `icon`: React.ReactNode - 커스텀 아이콘

```tsx
<Alert
  variant="success"
  title="성공"
  message="작업이 완료되었습니다."
  dismissible
  onDismiss={handleDismiss}
/>
```

### TabNavigation

- `items`: TabItem[] - 탭 아이템 배열
- `activeTab`: string - 현재 활성 탭 ID
- `onTabChange`: (tabId: string) => void - 탭 변경 시 콜백
- `variant`: 'default' | 'pills' | 'underline' | 'bottom' - 탭 스타일 (기본값: 'default')
- `size`: 'sm' | 'md' | 'lg' - 탭 크기 (기본값: 'md')
- `fullWidth`: boolean - 전체 너비 사용 여부 (기본값: false)

```tsx
<TabNavigation
  items={[
    { id: 'tab1', label: '홈', icon: '🏠' },
    { id: 'tab2', label: '설정', badge: '3' }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  variant="underline"
/>
```

### SegmentedControl

- `options`: SegmentOption[] - 선택 옵션 배열
- `value`: any - 현재 선택된 값
- `onChange`: (value: any, option: SegmentOption) => void - 값 변경 시 콜백
- `size`: 'sm' | 'md' | 'lg' - 크기 (기본값: 'md')
- `fullWidth`: boolean - 전체 너비 사용 여부 (기본값: false)
- `disabled`: boolean - 비활성화 여부 (기본값: false)

```tsx
<SegmentedControl
  options={[
    { id: 'option1', label: '옵션 1', value: 'option1' },
    { id: 'option2', label: '옵션 2', value: 'option2', icon: '⚙️' }
  ]}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  fullWidth
/>
```

## 테마 시스템

테마 설정은 `@/lib/theme`에서 관리됩니다.

```tsx
import { theme } from '@/lib/theme';

const myStyle = {
  backgroundColor: theme.colors.background.primary,
  color: theme.colors.text.primary,
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.base,
};
```

## 반응형 디자인

반응형 유틸리티는 `@/lib/responsive`에서 제공됩니다.

```tsx
import { mediaQueries, responsive } from '@/lib/responsive';

const responsiveStyle = {
  fontSize: responsive.fontSize.mobile.base,
  [mediaQueries.tablet]: {
    fontSize: responsive.fontSize.tablet.base,
  },
  [mediaQueries.desktop]: {
    fontSize: responsive.fontSize.desktop.base,
  },
};
```

## 데모 페이지

모든 컴포넌트의 사용 예제는 `/components` 페이지에서 확인할 수 있습니다.

### ModeSelector

- `options`: ModeSelectorOption[] - 선택 가능한 모드 배열
- `selectedMode`: string - 현재 선택된 모드
- `onModeChange`: (mode: string) => void - 모드 변경 시 콜백
- `label`: string - 라벨 텍스트 (기본값: 'Mode Selection')
- `disabled`: boolean - 비활성화 여부

```tsx
<ModeSelector
  options={[
    { value: 'media', label: '미디어 변환', icon: '🎬' },
    { value: 'pdf', label: 'PDF 변환', icon: '📄' }
  ]}
  selectedMode={selectedMode}
  onModeChange={setSelectedMode}
  label="변환 모드"
/>
```

### FormatSelector

- `availableFormats`: string[] - 선택 가능한 형식 배열
- `selectedFormat`: string - 현재 선택된 형식
- `onFormatChange`: (format: string) => void - 형식 변경 시 콜백
- `label`: string - 라벨 텍스트 (기본값: 'Output Format')
- `placeholder`: string - placeholder 텍스트
- `required`: boolean - 필수 입력 여부

```tsx
<FormatSelector
  availableFormats={['mp4', 'webm', 'avi', 'mov', 'gif']}
  selectedFormat={selectedFormat}
  onFormatChange={setSelectedFormat}
  label="출력 형식"
  placeholder="형식을 선택하세요"
  required
/>
```

### PlaybackSpeedControl

- `speed`: number - 현재 재생 속도
- `onSpeedChange`: (speed: number) => void - 속도 변경 시 콜백
- `min`: number - 최소값 (기본값: 0.25)
- `max`: number - 최대값 (기본값: 2.0)
- `step`: number - 단계값 (기본값: 0.25)
- `title`: string - 제목 텍스트
- `slowLabel`: string - 느림 라벨
- `fastLabel`: string - 빠름 라벨

```tsx
<PlaybackSpeedControl
  speed={playbackSpeed}
  onSpeedChange={setPlaybackSpeed}
  title="재생 속도 조절"
  slowLabel="느림"
  fastLabel="빠름"
/>
```

### VideoSettings

- `resolution`: string - 해상도 설정
- `onResolutionChange`: (resolution: string) => void - 해상도 변경 콜백
- `fps`: number - FPS 설정
- `onFpsChange`: (fps: number) => void - FPS 변경 콜백
- `bitrate`: string - 비트레이트 설정
- `onBitrateChange`: (bitrate: string) => void - 비트레이트 변경 콜백
- `quality`: string - 품질 설정
- `onQualityChange`: (quality: string) => void - 품질 변경 콜백
- `showBitrate`: boolean - 비트레이트 옵션 표시 여부
- `showGifNote`: boolean - GIF 관련 노트 표시 여부

```tsx
<VideoSettings
  resolution={resolution}
  onResolutionChange={setResolution}
  fps={fps}
  onFpsChange={setFps}
  bitrate={bitrate}
  onBitrateChange={setBitrate}
  quality={quality}
  onQualityChange={setQuality}
  showBitrate={true}
  showGifNote={false}
/>
```

### AudioSettings

- `sampleRate`: string - 샘플레이트 설정
- `onSampleRateChange`: (sampleRate: string) => void - 샘플레이트 변경 콜백
- `channels`: string - 채널 설정
- `onChannelsChange`: (channels: string) => void - 채널 변경 콜백
- `quality`: string - 품질 설정
- `onQualityChange`: (quality: string) => void - 품질 변경 콜백

```tsx
<AudioSettings
  sampleRate={sampleRate}
  onSampleRateChange={setSampleRate}
  channels={channels}
  onChannelsChange={setChannels}
  quality={quality}
  onQualityChange={setQuality}
/>
```

### ImageSettings

- `resolution`: string - 해상도 설정
- `onResolutionChange`: (resolution: string) => void - 해상도 변경 콜백
- `quality`: string - 품질 설정
- `onQualityChange`: (quality: string) => void - 품질 변경 콜백

```tsx
<ImageSettings
  resolution={resolution}
  onResolutionChange={setResolution}
  quality={quality}
  onQualityChange={setQuality}
/>
```

### ConversionInfo

- `title`: string - 제목 텍스트
- `items`: ConversionInfoItem[] - 표시할 정보 아이템 배열
- `status`: 'ready' | 'converting' | 'completed' - 변환 상태
- `progress`: number - 진행 상황 (0-100)

```tsx
<ConversionInfo
  title="변환 준비 완료"
  status="ready"
  items={[
    { label: '입력 파일', value: 'video.mp4' },
    { label: '출력 형식', value: 'GIF' },
    { label: '파일 크기', value: '15.2 MB' }
  ]}
/>
```

### ConversionResult

- `filename`: string - 파일명 (필수)
- `fileSize`: string - 파일 크기 (필수)
- `format`: string - 파일 형식 (필수)
- `onDownload`: () => void - 다운로드 콜백 (필수)
- `previewUrl`: string - 미리보기 URL
- `previewType`: 'image' | 'video' | 'audio' | 'gif' - 미리보기 타입
- `onReset`: () => void - 초기화 콜백
- `showPreview`: boolean - 미리보기 표시 여부

```tsx
<ConversionResult
  filename="converted_video.gif"
  fileSize="8.2"
  format="gif"
  onDownload={() => downloadFile()}
  onReset={() => resetConverter()}
  downloadLabel="파일 다운로드"
  resetLabel="다른 파일 변환"
  showPreview={true}
/>
```

## 디자인 원칙

1. **일관성**: 모든 컴포넌트는 동일한 디자인 토큰을 사용합니다.
2. **접근성**: 키보드 네비게이션과 스크린 리더를 지원합니다.
3. **성능**: 최적화된 렌더링과 적절한 메모이제이션을 적용합니다.
4. **확장성**: 새로운 variant와 props를 쉽게 추가할 수 있습니다.
5. **타입 안정성**: TypeScript를 통한 완전한 타입 지원을 제공합니다.
