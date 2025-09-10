'use client';

import { useState } from 'react';
import { 
  Button, 
  Card, 
  Input, 
  Typography,
  PlaybackSpeedControl,
  VideoSettings,
  AudioSettings,
  ImageSettings,
  ModeSelector,
  CustomFileInput,
  ConverterLayout,
  ConverterForm,
  ConverterResult
} from '@/components/ui';
import { theme } from '@/lib/theme';

export default function ComponentsDemo() {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [customFiles, setCustomFiles] = useState<FileList | null>(null);
  
  // Converter component states
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [selectedMode, setSelectedMode] = useState('media');
  const [videoSettings, setVideoSettings] = useState({
    resolution: 'original',
    fps: 30,
    bitrate: '',
    quality: 'medium'
  });
  const [audioSettings, setAudioSettings] = useState({
    sampleRate: '',
    channels: '',
    quality: 'medium'
  });
  const [imageSettings, setImageSettings] = useState({
    resolution: 'original',
    quality: 'medium'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setInputError(e.target.value.length > 0 && e.target.value.length < 3);
  };

  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomFiles(e.target.files);
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily.primary,
  };

  const sectionStyle = {
    marginBottom: theme.spacing['4xl'],
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing['2xl'],
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
          QuokkaConverter UI 컴포넌트
        </Typography>
        <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing['4xl'] }}>
          QuokkaConverter에서 실제 사용되는 UI 컴포넌트들입니다. 
          모든 컴포넌트는 변환 기능에 최적화되어 있습니다.
        </Typography>

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
          </div>
          <pre style={codeBlockStyle}>
{`<Card>기본 카드</Card>
<Card glass>글래스 카드</Card>`}
          </pre>
        </div>

        {/* ModeSelector Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            ModeSelector
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            모드 선택을 위한 드롭다운 컴포넌트입니다.
          </Typography>

          <Card style={demoCardStyle}>
            <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
              변환 모드 선택기
            </Typography>
            <ModeSelector
              options={[
                { value: 'media', label: '미디어 변환', icon: '🎬' },
                { value: 'pdf', label: 'PDF 변환', icon: '📄' }
              ]}
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              label="변환 모드"
            />
            <Typography variant="small" color="tertiary" style={{ marginTop: theme.spacing.sm }}>
              선택된 모드: {selectedMode}
            </Typography>
          </Card>
          
          <pre style={codeBlockStyle}>
{`<ModeSelector
  options={[
    { value: 'media', label: '미디어 변환', icon: '🎬' },
    { value: 'pdf', label: 'PDF 변환', icon: '📄' }
  ]}
  selectedMode={selectedMode}
  onModeChange={setSelectedMode}
  label="변환 모드"
/>`}
          </pre>
        </div>

        {/* CustomFileInput Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            CustomFileInput
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            변환기에서 사용되는 커스텀 파일 입력 컴포넌트입니다.
          </Typography>

          <div style={gridStyle}>
            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                단일 파일 선택
              </Typography>
              <CustomFileInput
                id="singleFile"
                accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                onChange={handleCustomFileChange}
                selectedFiles={customFiles}
                placeholder="파일을 선택하세요"
              />
            </Card>

            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                다중 파일 선택
              </Typography>
              <CustomFileInput
                id="multipleFiles"
                accept="image/*"
                multiple
                onChange={handleCustomFileChange}
                selectedFiles={customFiles}
                placeholder="여러 이미지를 선택하세요"
              />
            </Card>
          </div>
          
          <pre style={codeBlockStyle}>
{`<CustomFileInput
  id="fileInput"
  accept=".jpg,.jpeg,.png,.gif"
  multiple={true}
  onChange={handleFileChange}
  selectedFiles={files}
  placeholder="파일을 선택하세요"
/>`}
          </pre>
        </div>

        {/* PlaybackSpeedControl Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            PlaybackSpeedControl
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            재생 속도 조절을 위한 슬라이더 컴포넌트입니다.
          </Typography>

          <Card style={demoCardStyle}>
            <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
              재생 속도 컨트롤
            </Typography>
            <PlaybackSpeedControl
              speed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              title="재생 속도 조절"
              slowLabel="느림"
              fastLabel="빠름"
            />
          </Card>
          
          <pre style={codeBlockStyle}>
{`<PlaybackSpeedControl
  speed={playbackSpeed}
  onSpeedChange={setPlaybackSpeed}
  title="재생 속도 조절"
  slowLabel="느림"
  fastLabel="빠름"
/>`}
          </pre>
        </div>

        {/* MediaSettings Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            MediaSettings
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            비디오, 오디오, 이미지 설정을 위한 패널 컴포넌트입니다.
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xl }}>
            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                비디오 설정
              </Typography>
              <VideoSettings
                resolution={videoSettings.resolution}
                onResolutionChange={(resolution) => 
                  setVideoSettings(prev => ({ ...prev, resolution }))
                }
                fps={videoSettings.fps}
                onFpsChange={(fps) => 
                  setVideoSettings(prev => ({ ...prev, fps }))
                }
                bitrate={videoSettings.bitrate}
                onBitrateChange={(bitrate) => 
                  setVideoSettings(prev => ({ ...prev, bitrate }))
                }
                quality={videoSettings.quality}
                onQualityChange={(quality) => 
                  setVideoSettings(prev => ({ ...prev, quality }))
                }
                showGifNote={true}
              />
            </Card>

            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                오디오 설정
              </Typography>
              <AudioSettings
                sampleRate={audioSettings.sampleRate}
                onSampleRateChange={(sampleRate) => 
                  setAudioSettings(prev => ({ ...prev, sampleRate }))
                }
                channels={audioSettings.channels}
                onChannelsChange={(channels) => 
                  setAudioSettings(prev => ({ ...prev, channels }))
                }
                quality={audioSettings.quality}
                onQualityChange={(quality) => 
                  setAudioSettings(prev => ({ ...prev, quality }))
                }
              />
            </Card>

            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                이미지 설정
              </Typography>
              <ImageSettings
                resolution={imageSettings.resolution}
                onResolutionChange={(resolution) => 
                  setImageSettings(prev => ({ ...prev, resolution }))
                }
                quality={imageSettings.quality}
                onQualityChange={(quality) => 
                  setImageSettings(prev => ({ ...prev, quality }))
                }
              />
            </Card>
          </div>
          
          <pre style={codeBlockStyle}>
{`<VideoSettings
  resolution={resolution}
  onResolutionChange={setResolution}
  fps={fps}
  onFpsChange={setFps}
  quality={quality}
  onQualityChange={setQuality}
/>

<AudioSettings
  sampleRate={sampleRate}
  onSampleRateChange={setSampleRate}
  channels={channels}
  onChannelsChange={setChannels}
  quality={quality}
  onQualityChange={setQuality}
/>

<ImageSettings
  resolution={resolution}
  onResolutionChange={setResolution}
  quality={quality}
  onQualityChange={setQuality}
/>`}
          </pre>
        </div>

        {/* Converter Components Section */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            변환기 전용 컴포넌트들
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            변환기에서 공통으로 사용하는 레이아웃과 폼, 결과 표시 컴포넌트들입니다.
          </Typography>
          
          <div style={gridStyle}>
            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                ConverterForm
              </Typography>
              <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.lg }}>
                변환 폼을 위한 공통 컴포넌트입니다. 로딩 상태와 제출 버튼을 관리합니다.
              </Typography>
              <ConverterForm
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('폼 제출됨');
                }}
                submitLabel="변환 시작"
                loading={false}
                loadingLabel="변환 중..."
              >
                <div style={{ marginBottom: theme.spacing.md }}>
                  <label>예시 설정</label>
                  <select style={{ width: '100%', padding: '8px' }}>
                    <option>옵션 1</option>
                    <option>옵션 2</option>
                  </select>
                </div>
              </ConverterForm>
            </Card>

            <Card style={demoCardStyle}>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.lg }}>
                ConverterResult
              </Typography>
              <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.lg }}>
                변환 결과를 표시하고 다운로드 기능을 제공하는 컴포넌트입니다.
              </Typography>
              <ConverterResult
                result={new Blob(['test'], { type: 'text/plain' })}
                filename="example-file"
                format="txt"
                downloadLabel="파일 다운로드"
              />
            </Card>
          </div>
          
          <pre style={codeBlockStyle}>
{`<ConverterForm
  onSubmit={handleSubmit}
  submitLabel="변환 시작"
  loading={loading}
  loadingLabel="변환 중..."
>
  {/* 폼 내용 */}
</ConverterForm>

<ConverterResult
  result={blob}
  filename="converted-file"
  format="pdf"
  previewUrl={previewUrl}
  downloadLabel="다운로드"
/>`}
          </pre>
        </div>

        {/* Converter Integration Example */}
        <div style={sectionStyle}>
          <Typography variant="h2" color="primary">
            변환기 통합 예시
          </Typography>
          <Typography variant="body" color="secondary" style={{ marginBottom: theme.spacing.xl }}>
            ConverterLayout을 사용한 완전한 변환기 인터페이스 예시입니다.
          </Typography>
          
          <div style={{ border: `2px solid ${theme.colors.border.primary}`, borderRadius: theme.borderRadius.base, overflow: 'hidden' }}>
            <ConverterLayout
              subtitle="데모 변환기"
              ready={!!(customFiles && customFiles.length > 0)}
              readyInfo={[
                { label: '선택된 파일', value: customFiles?.length || 0 },
                { label: '변환 모드', value: selectedMode },
                { label: '상태', value: '준비 완료' }
              ]}
              readyTitle="변환 준비 완료"
              readyMessage="변환 버튼을 클릭하여 시작하세요"
            >
              <ConverterForm
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('데모 변환기 실행');
                }}
                submitLabel="변환 시작"
                loading={false}
                loadingLabel="변환 중..."
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
                  {/* 1. Mode Selection */}
                  <div>
                    <Typography variant="caption" color="primary" style={{ marginBottom: theme.spacing.sm, display: 'block', fontWeight: 600 }}>
                      1. 변환 모드 선택
                    </Typography>
                    <ModeSelector
                      options={[
                        { value: 'media', label: '미디어 변환', icon: '🎬' },
                        { value: 'gif', label: 'GIF 생성', icon: '🎞️' },
                        { value: 'pdf', label: 'PDF 관리', icon: '📄' }
                      ]}
                      selectedMode={selectedMode}
                      onModeChange={setSelectedMode}
                      label="변환 타입"
                    />
                  </div>

                  {/* 2. File Upload */}
                  <div>
                    <Typography variant="caption" color="primary" style={{ marginBottom: theme.spacing.sm, display: 'block', fontWeight: 600 }}>
                      2. 파일 업로드
                    </Typography>
                    <CustomFileInput
                      id="demoFile"
                      accept={selectedMode === 'media' ? '.mp4,.mov,.avi,.mp3,.wav,.jpg,.png' : 
                               selectedMode === 'gif' ? 'image/*' : '.pdf,image/*'}
                      multiple={selectedMode === 'gif'}
                      onChange={handleCustomFileChange}
                      selectedFiles={customFiles}
                      placeholder={selectedMode === 'media' ? '미디어 파일 선택' : 
                                  selectedMode === 'gif' ? '이미지들 선택' : 'PDF 또는 이미지 선택'}
                    />
                  </div>

                  {/* 3. Settings based on mode */}
                  {selectedMode === 'gif' && (
                    <div>
                      <Typography variant="caption" color="primary" style={{ marginBottom: theme.spacing.sm, display: 'block', fontWeight: 600 }}>
                        3. 재생 속도 조절 (GIF 전용)
                      </Typography>
                      <PlaybackSpeedControl
                        speed={playbackSpeed}
                        onSpeedChange={setPlaybackSpeed}
                        title="재생 속도"
                        slowLabel="느림"
                        fastLabel="빠름"
                      />
                    </div>
                  )}
                </div>
              </ConverterForm>
            </ConverterLayout>
          </div>
          
          <div style={{ marginTop: theme.spacing.xl, padding: theme.spacing.lg, backgroundColor: theme.colors.background.tertiary, borderRadius: theme.borderRadius.base }}>
            <Typography variant="caption" color="secondary" style={{ fontStyle: 'italic' }}>
              💡 ConverterLayout은 모든 변환기 페이지에서 공통으로 사용하는 레이아웃 컴포넌트입니다. 
              Header, ErrorMessage, ResultPlaceholder 등을 통합 관리하여 일관된 사용자 경험을 제공합니다.
            </Typography>
          </div>
          
          <pre style={codeBlockStyle}>
{`<ConverterLayout
  subtitle="변환기 제목"
  error={error}
  loading={loading}
  loadingInfo={loadingInfo}
  ready={hasFiles}
  readyInfo={readyInfo}
  result={resultComponent}
>
  <ConverterForm onSubmit={handleSubmit} submitLabel="변환 시작">
    {/* 폼 내용 */}
  </ConverterForm>
</ConverterLayout>`}
          </pre>
        </div>
      </div>
    </div>
  );
}