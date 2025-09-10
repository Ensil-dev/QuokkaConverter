'use client';

import { useState } from 'react';
import { Button, Card, Input, Typography, Carousel, CarouselItem, Navbar, Footer, Hero } from '@/components/ui';
import { theme } from '@/lib/theme';

export default function ComponentsDemo() {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputError(e.target.value.length > 0 && e.target.value.length < 3);
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing['2xl'],
    fontFamily: theme.typography.fontFamily.primary,
    '@media (max-width: 768px)': {
      padding: theme.spacing.lg,
    },
  };

  const sectionStyle = {
    marginBottom: theme.spacing['4xl'],
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.xl,
    marginBottom: theme.spacing['2xl'],
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: theme.spacing.lg,
    },
  };

  const demoCardStyle = {
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  };

  const codeBlockStyle = {
    backgroundColor: theme.colors.background.tertiary,
    border: `1px solid ${theme.colors.border.primary}`,
    borderRadius: theme.borderRadius.base,
    padding: theme.spacing.lg,
    fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    overflow: 'auto',
    marginTop: theme.spacing.md,
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: theme.layout.maxWidth, margin: '0 auto' }}>
        <Typography variant="h1" color="primary">
          디자인 시스템 컴포넌트
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing['4xl'] }}>
          Linear.app에서 영감을 받은 다크 테마 디자인 시스템입니다. 
          모든 컴포넌트는 일관된 스타일과 인터랙션을 제공합니다.
        </Typography>

        {/* Hero Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            Hero
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            랜딩 페이지의 메인 섹션으로 사용하는 히어로 컴포넌트입니다. 다양한 크기와 배경 옵션을 제공합니다.
          </Typography>
          
          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg }}>
            기본 히어로
          </Typography>
          <div style={{ marginBottom: theme.spacing['2xl'] }}>
            <Hero
              subtitle="새로운 경험"
              title="혁신적인 디자인 시스템"
              description="Linear.app에서 영감을 받은 완벽한 다크 테마 디자인 시스템으로 사용자 경험을 향상시키세요."
              size="md"
              actions={[
                {
                  id: 'get-started',
                  label: '시작하기',
                  variant: 'primary'
                },
                {
                  id: 'learn-more',
                  label: '더 알아보기',
                  variant: 'ghost'
                }
              ]}
            />
          </div>

          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg }}>
            배경 이미지 히어로
          </Typography>
          <div style={{ marginBottom: theme.spacing['2xl'] }}>
            <Hero
              title="아름다운 비주얼과 함께"
              description="고품질 이미지 배경과 오버레이 효과로 인상적인 첫인상을 만들어보세요."
              size="sm"
              backgroundImage="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
              overlay={true}
              overlayOpacity={0.7}
              actions={[
                {
                  id: 'explore',
                  label: '탐색하기',
                  variant: 'primary',
                  size: 'lg'
                }
              ]}
            />
          </div>

          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg }}>
            작은 크기 히어로
          </Typography>
          <div style={{ marginBottom: theme.spacing['2xl'] }}>
            <Hero
              title="컴팩트한 히어로"
              description="페이지 상단에 적합한 작은 크기의 히어로 섹션입니다."
              size="sm"
              centerContent={false}
              actions={[
                {
                  id: 'action',
                  label: '액션 버튼',
                  variant: 'primary',
                  size: 'md'
                }
              ]}
            />
          </div>

          <pre style={codeBlockStyle}>
{`<Hero
  subtitle="부제목"
  title="메인 제목"
  description="설명 텍스트"
  size="lg"
  backgroundImage="image-url"
  overlay={true}
  overlayOpacity={0.6}
  actions={[
    {
      id: 'cta',
      label: '시작하기',
      variant: 'primary'
    }
  ]}
/>`}
          </pre>
        </div>

        {/* Typography Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            Typography
          </Typography>
          <Card style={demoCardStyle}>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="body">
              Body text - 기본 본문 텍스트입니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
            <Typography variant="caption" color="secondary">
              Caption text - 부가 설명 텍스트입니다.
            </Typography>
            <Typography variant="small" color="tertiary">
              Small text - 작은 크기의 텍스트입니다.
            </Typography>
          </Card>
          <pre style={codeBlockStyle}>
{`<Typography variant="h1">Heading 1</Typography>
<Typography variant="body" color="secondary">Body text</Typography>
<Typography variant="caption" color="tertiary">Caption</Typography>`}
          </pre>
        </div>

        {/* Buttons Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            Buttons
          </Typography>
          <div style={gridStyle}>
            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                Primary Buttons
              </Typography>
              <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.lg, flexWrap: 'wrap' }}>
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
              <Button variant="primary" disabled style={{ opacity: 0.5 }}>
                Disabled
              </Button>
            </Card>

            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                Ghost Buttons
              </Typography>
              <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.lg, flexWrap: 'wrap' }}>
                <Button variant="ghost" size="sm">Small</Button>
                <Button variant="ghost" size="md">Medium</Button>
                <Button variant="ghost" size="lg">Large</Button>
              </div>
              <Button variant="ghost" disabled style={{ opacity: 0.5 }}>
                Disabled
              </Button>
            </Card>
          </div>
          <pre style={codeBlockStyle}>
{`<Button variant="primary" size="md">Primary Button</Button>
<Button variant="ghost" size="md">Ghost Button</Button>
<Button variant="primary" disabled>Disabled Button</Button>`}
          </pre>
        </div>

        {/* Inputs Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            Inputs
          </Typography>
          <div style={gridStyle}>
            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                기본 Input
              </Typography>
              <Input
                label="이메일"
                placeholder="이메일을 입력하세요"
                type="email"
                helperText="유효한 이메일 주소를 입력해주세요"
                style={{ marginBottom: theme.spacing.lg }}
              />
              <Input
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                type="password"
              />
            </Card>

            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                상태별 Input
              </Typography>
              <Input
                label="검증 테스트"
                placeholder="3글자 이상 입력하세요"
                value={inputValue}
                onChange={handleInputChange}
                error={inputError}
                helperText={inputError ? '최소 3글자 이상 입력해야 합니다' : '올바른 형식입니다'}
                style={{ marginBottom: theme.spacing.lg }}
              />
              <Input
                label="비활성화된 Input"
                placeholder="비활성화됨"
                disabled
                style={{ opacity: 0.6 }}
              />
            </Card>
          </div>
          <pre style={codeBlockStyle}>
{`<Input 
  label="라벨" 
  placeholder="플레이스홀더"
  helperText="도움말 텍스트" 
/>
<Input error helperText="에러 메시지" />
<Input disabled />`}
          </pre>
        </div>

        {/* Cards Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            Cards
          </Typography>
          
          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg, marginTop: theme.spacing.xl }}>
            기본 카드
          </Typography>
          <div style={gridStyle}>
            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                기본 카드
              </Typography>
              <Typography variant="body" color="secondary">
                기본 스타일의 카드 컴포넌트입니다. 다양한 콘텐츠를 담을 수 있습니다.
              </Typography>
            </Card>

            <Card glass style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                글래스 카드
              </Typography>
              <Typography variant="body" color="secondary">
                glassmorphism 효과가 적용된 카드입니다. 반투명하고 블러 효과가 있습니다.
              </Typography>
            </Card>

            <Card padding="lg" style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                큰 패딩 카드
              </Typography>
              <Typography variant="body" color="secondary">
                더 넓은 패딩을 가진 카드입니다. 중요한 콘텐츠를 강조할 때 사용합니다.
              </Typography>
            </Card>

            <Card padding="sm" style={demoCardStyle}>
              <Typography variant="caption" color="primary" style={{ marginBottom: theme.spacing.sm }}>
                작은 패딩 카드
              </Typography>
              <Typography variant="small" color="secondary">
                작은 패딩을 가진 컴팩트한 카드입니다.
              </Typography>
            </Card>
          </div>

          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg, marginTop: theme.spacing.xl }}>
            이미지 카드
          </Typography>
          <div style={gridStyle}>
            <Card
              image="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              imageAlt="고양이"
              imagePosition="top"
              imageHeight="180px"
            >
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                상단 이미지 카드
              </Typography>
              <Typography variant="body" color="secondary">
                이미지가 카드 상단에 위치합니다. 가장 일반적인 카드 레이아웃입니다.
              </Typography>
            </Card>

            <Card
              image="https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              imageAlt="자연"
              imagePosition="left"
              imageHeight="120px"
            >
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                왼쪽 이미지 카드
              </Typography>
              <Typography variant="body" color="secondary">
                이미지가 카드 왼쪽에 위치합니다. 가로형 레이아웃에 적합합니다.
              </Typography>
            </Card>

            <Card
              image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              imageAlt="산"
              imagePosition="right"
              imageHeight="120px"
            >
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                오른쪽 이미지 카드
              </Typography>
              <Typography variant="body" color="secondary">
                이미지가 카드 오른쪽에 위치합니다. 텍스트를 먼저 보여주고 싶을 때 사용합니다.
              </Typography>
            </Card>

            <Card
              glass
              image="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              imageAlt="풍경"
              imagePosition="top"
              imageHeight="160px"
            >
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                글래스 이미지 카드
              </Typography>
              <Typography variant="body" color="secondary">
                글래스 효과와 이미지를 함께 사용한 카드입니다.
              </Typography>
            </Card>
          </div>

          <pre style={codeBlockStyle}>
{`<Card>기본 카드</Card>
<Card glass>글래스 카드</Card>  
<Card padding="lg">큰 패딩 카드</Card>
<Card 
  image="image-url" 
  imagePosition="top"
  imageHeight="180px"
>
  이미지 카드
</Card>`}
          </pre>
        </div>

        {/* Carousel Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            Carousel
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            이미지나 콘텐츠를 슬라이드 형태로 보여주는 캐러셀 컴포넌트입니다.
          </Typography>
          
          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg }}>
            이미지 캐러셀
          </Typography>
          <div style={{ marginBottom: theme.spacing['2xl'] }}>
            <Carousel
              items={[
                {
                  id: '1',
                  content: (
                    <div style={{ position: 'relative' }}>
                      <img
                        src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                        alt="고양이"
                        style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        padding: theme.spacing.xl,
                        color: 'white'
                      }}>
                        <Typography variant="h4" color="primary" as="h3" style={{ color: 'white', margin: 0 }}>
                          귀여운 고양이
                        </Typography>
                        <Typography variant="body" color="secondary" as="p" style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                          사랑스러운 고양이의 모습
                        </Typography>
                      </div>
                    </div>
                  )
                },
                {
                  id: '2',
                  content: (
                    <div style={{ position: 'relative' }}>
                      <img
                        src="https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                        alt="자연"
                        style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        padding: theme.spacing.xl,
                        color: 'white'
                      }}>
                        <Typography variant="h4" color="primary" as="h3" style={{ color: 'white', margin: 0 }}>
                          아름다운 자연
                        </Typography>
                        <Typography variant="body" color="secondary" as="p" style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                          푸른 하늘과 구름의 조화
                        </Typography>
                      </div>
                    </div>
                  )
                },
                {
                  id: '3',
                  content: (
                    <div style={{ position: 'relative' }}>
                      <img
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                        alt="산"
                        style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        padding: theme.spacing.xl,
                        color: 'white'
                      }}>
                        <Typography variant="h4" color="primary" as="h3" style={{ color: 'white', margin: 0 }}>
                          웅장한 산맥
                        </Typography>
                        <Typography variant="body" color="secondary" as="p" style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                          자연의 위대한 경관
                        </Typography>
                      </div>
                    </div>
                  )
                }
              ]}
              autoPlay={true}
              autoPlayInterval={4000}
              showDots={true}
              showArrows={true}
              infinite={true}
            />
          </div>

          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg }}>
            콘텐츠 캐러셀
          </Typography>
          <div style={{ marginBottom: theme.spacing['2xl'] }}>
            <Carousel
              items={[
                {
                  id: 'content1',
                  content: (
                    <Card padding="xl" style={{ margin: theme.spacing.md }}>
                      <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        슬라이드 1
                      </Typography>
                      <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.lg }}>
                        첫 번째 슬라이드 콘텐츠입니다. 카드 형태의 콘텐츠를 캐러셀로 보여줄 수 있습니다.
                      </Typography>
                      <Button variant="primary">더 알아보기</Button>
                    </Card>
                  )
                },
                {
                  id: 'content2',
                  content: (
                    <Card glass padding="xl" style={{ margin: theme.spacing.md }}>
                      <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.md }}>
                        슬라이드 2
                      </Typography>
                      <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.lg }}>
                        두 번째 슬라이드 콘텐츠입니다. 글래스 효과가 적용된 카드입니다.
                      </Typography>
                      <Button variant="ghost">자세히 보기</Button>
                    </Card>
                  )
                },
                {
                  id: 'content3',
                  content: (
                    <Card padding="xl" style={{ 
                      margin: theme.spacing.md,
                      background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.hover})`,
                      border: 'none'
                    }}>
                      <Typography variant="h3" as="h3" style={{ color: 'white', marginBottom: theme.spacing.md }}>
                        슬라이드 3
                      </Typography>
                      <Typography variant="body" as="p" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: theme.spacing.lg }}>
                        세 번째 슬라이드 콘텐츠입니다. 그라디언트 배경이 적용되어 있습니다.
                      </Typography>
                      <Button variant="primary">시작하기</Button>
                    </Card>
                  )
                }
              ]}
              autoPlay={false}
              showDots={true}
              showArrows={true}
              infinite={true}
            />
          </div>

          <pre style={codeBlockStyle}>
{`<Carousel
  items={[
    {
      id: '1',
      content: <div>슬라이드 콘텐츠</div>
    },
    // ... 더 많은 아이템들
  ]}
  autoPlay={true}
  autoPlayInterval={4000}
  showDots={true}
  showArrows={true}
  infinite={true}
/>`}
          </pre>
        </div>

        {/* Complex Example */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            복합 예제
          </Typography>
          <Card style={demoCardStyle}>
            <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.md }}>
              사용자 등록 폼
            </Typography>
            <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
              여러 컴포넌트를 조합한 실제 사용 예제입니다.
            </Typography>
            
            <div style={{ display: 'grid', gap: theme.spacing.lg, marginBottom: theme.spacing.xl }}>
              <Input
                label="이름"
                placeholder="이름을 입력하세요"
                required
              />
              <Input
                label="이메일"
                placeholder="이메일을 입력하세요"
                type="email"
                required
              />
              <Input
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                type="password"
                helperText="최소 8자 이상, 특수문자 포함"
                required
              />
            </div>
            
            <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'flex-end' }}>
              <Button variant="ghost">취소</Button>
              <Button variant="primary">등록하기</Button>
            </div>
          </Card>
        </div>

        {/* Color Palette */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            컬러 팔레트
          </Typography>
          <div style={gridStyle}>
            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                배경 컬러
              </Typography>
              <div style={{ display: 'grid', gap: theme.spacing.md }}>
                <div style={{ 
                  padding: theme.spacing.md, 
                  backgroundColor: theme.colors.background.primary,
                  border: `1px solid ${theme.colors.border.primary}`,
                  borderRadius: theme.borderRadius.base,
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.sm,
                }}>
                  Primary: {theme.colors.background.primary}
                </div>
                <div style={{ 
                  padding: theme.spacing.md, 
                  backgroundColor: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border.primary}`,
                  borderRadius: theme.borderRadius.base,
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.sm,
                }}>
                  Secondary: {theme.colors.background.secondary}
                </div>
                <div style={{ 
                  padding: theme.spacing.md, 
                  backgroundColor: theme.colors.background.tertiary,
                  border: `1px solid ${theme.colors.border.primary}`,
                  borderRadius: theme.borderRadius.base,
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.sm,
                }}>
                  Tertiary: {theme.colors.background.tertiary}
                </div>
              </div>
            </Card>

            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                텍스트 컬러
              </Typography>
              <div style={{ display: 'grid', gap: theme.spacing.md }}>
                <Typography variant="body" color="primary">
                  Primary Text: {theme.colors.text.primary}
                </Typography>
                <Typography variant="body" color="secondary">
                  Secondary Text: {theme.colors.text.secondary}
                </Typography>
                <Typography variant="body" color="tertiary">
                  Tertiary Text: {theme.colors.text.tertiary}
                </Typography>
                <Typography variant="body" color="quaternary">
                  Quaternary Text: {theme.colors.text.quaternary}
                </Typography>
              </div>
            </Card>

            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                액센트 컬러
              </Typography>
              <div style={{ 
                padding: theme.spacing.md, 
                backgroundColor: theme.colors.accent.primary,
                borderRadius: theme.borderRadius.base,
                color: 'white',
                fontSize: theme.typography.fontSize.sm,
                textAlign: 'center' as const,
                marginBottom: theme.spacing.md,
              }}>
                Accent Primary: {theme.colors.accent.primary}
              </div>
              <div style={{ 
                padding: theme.spacing.md, 
                backgroundColor: theme.colors.accent.hover,
                borderRadius: theme.borderRadius.base,
                color: 'white',
                fontSize: theme.typography.fontSize.sm,
                textAlign: 'center' as const,
              }}>
                Accent Hover: {theme.colors.accent.hover}
              </div>
            </Card>
          </div>
        </div>

        {/* Navbar Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            Navbar
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            웹사이트 상단에 위치하는 네비게이션 바 컴포넌트입니다. 고정 위치, 투명 효과, 모바일 대응을 지원합니다.
          </Typography>
          
          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg }}>
            기본 네비게이션
          </Typography>
          <div style={{ marginBottom: theme.spacing['2xl'], position: 'relative', minHeight: '120px' }}>
            <Navbar
              logoText="QuokkaConverter"
              items={[
                { id: 'home', label: '홈', active: true },
                { id: 'about', label: '소개' },
                { id: 'services', label: '서비스' },
                { id: 'contact', label: '연락처' }
              ]}
              rightContent={
                <div style={{ display: 'flex', gap: theme.spacing.md }}>
                  <Button variant="ghost" size="sm">로그인</Button>
                  <Button variant="primary" size="sm">회원가입</Button>
                </div>
              }
              sticky={false}
              transparent={false}
            />
            <div style={{ 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: theme.spacing.lg,
              color: theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.sm 
            }}>
              데모용 네비게이션 바입니다.
            </div>
          </div>

          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg }}>
            투명 네비게이션
          </Typography>
          <div style={{ marginBottom: theme.spacing['2xl'], position: 'relative', minHeight: '120px', background: 'linear-gradient(135deg, rgba(94, 106, 210, 0.1), rgba(76, 89, 189, 0.05))' }}>
            <Navbar
              logoText="Brand"
              items={[
                { id: 'products', label: '제품', active: true },
                { id: 'solutions', label: '솔루션' },
                { id: 'pricing', label: '가격' }
              ]}
              rightContent={
                <Button variant="ghost" size="sm">시작하기</Button>
              }
              sticky={false}
              transparent={true}
            />
            <div style={{ 
              height: '60px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: theme.spacing.lg,
              color: theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.sm 
            }}>
              투명 배경의 네비게이션 바입니다.
            </div>
          </div>

          <pre style={codeBlockStyle}>
{`<Navbar
  logoText="Brand"
  items={[
    { id: 'home', label: '홈', active: true },
    { id: 'about', label: '소개' }
  ]}
  rightContent={
    <Button variant="primary">액션 버튼</Button>
  }
  sticky={true}
  transparent={false}
/>`}
          </pre>
        </div>

        {/* Footer Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            Footer
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            웹사이트 하단에 위치하는 푸터 컴포넌트입니다. 링크 섹션, 소셜 링크, 저작권 정보를 포함할 수 있습니다.
          </Typography>
          
          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg }}>
            전체 기능 푸터
          </Typography>
          <div style={{ marginBottom: theme.spacing['2xl'] }}>
            <Footer
              logoText="QuokkaConverter"
              description="무료 온라인 파일 변환 서비스를 제공합니다. 비디오, 오디오, 이미지를 다양한 형식으로 변환하세요."
              sections={[
                {
                  id: 'product',
                  title: '제품',
                  links: [
                    { id: 'video', label: '비디오 변환' },
                    { id: 'audio', label: '오디오 변환' },
                    { id: 'image', label: '이미지 변환' },
                    { id: 'pdf', label: 'PDF 관리' }
                  ]
                },
                {
                  id: 'company',
                  title: '회사',
                  links: [
                    { id: 'about', label: '소개' },
                    { id: 'blog', label: '블로그' },
                    { id: 'careers', label: '채용' },
                    { id: 'contact', label: '연락처' }
                  ]
                },
                {
                  id: 'support',
                  title: '지원',
                  links: [
                    { id: 'help', label: '도움말' },
                    { id: 'faq', label: 'FAQ' },
                    { id: 'privacy', label: '개인정보처리방침' },
                    { id: 'terms', label: '이용약관' }
                  ]
                }
              ]}
              socialLinks={[
                { id: 'twitter', label: '𝕏' },
                { id: 'facebook', label: 'f' },
                { id: 'instagram', label: '📷' },
                { id: 'linkedin', label: 'in' }
              ]}
              copyright="© 2024 QuokkaConverter. All rights reserved."
            />
          </div>

          <Typography variant="h3" color="primary" style={{ marginBottom: theme.spacing.lg }}>
            미니멀 푸터
          </Typography>
          <div style={{ marginBottom: theme.spacing['2xl'] }}>
            <Footer
              logoText="Brand"
              minimal={true}
              socialLinks={[
                { id: 'github', label: '⚡' },
                { id: 'discord', label: '💬' }
              ]}
              copyright="© 2024 Brand. All rights reserved."
            />
          </div>

          <pre style={codeBlockStyle}>
{`<Footer
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
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}