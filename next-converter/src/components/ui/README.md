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
  Hero 
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

## 디자인 원칙

1. **일관성**: 모든 컴포넌트는 동일한 디자인 토큰을 사용합니다.
2. **접근성**: 키보드 네비게이션과 스크린 리더를 지원합니다.
3. **성능**: 최적화된 렌더링과 적절한 메모이제이션을 적용합니다.
4. **확장성**: 새로운 variant와 props를 쉽게 추가할 수 있습니다.
5. **타입 안정성**: TypeScript를 통한 완전한 타입 지원을 제공합니다.
