import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { convertFile, SUPPORTED_FORMATS, isConversionSupported } from './universalConverter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어 추가
app.use(express.json());

// 정적 파일 제공 - 상위 디렉토리의 public 폴더를 사용
app.use(express.static(path.join(__dirname, '..', 'public')));

// 업로드/아웃풋 폴더 준비
const uploadDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'outputs');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 지원하는 포맷 정보 API
app.get('/api/formats', (req, res) => {
  res.json(SUPPORTED_FORMATS);
});

// 변환 가능한 조합 확인 API
app.post('/api/check-conversion', (req, res) => {
  try {
    const { inputFormat, outputFormat } = req.body;
    const isSupported = isConversionSupported(inputFormat, outputFormat);
    res.json({ supported: isSupported });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 범용 변환 API
app.post('/api/convert', upload.single('file'), async (req, res) => {
  try {
    const { 
      outputFormat, 
      resolution, 
      fps, 
      bitrate, 
      quality, 
      sampleRate, 
      channels,
      codec 
    } = req.body;
    
    const inputPath = req.file.path;
    const inputExt = path.extname(req.file.originalname).slice(1).toLowerCase();
    
    // 출력 형식이 지정되지 않은 경우 기본값 설정
    let targetFormat = outputFormat;
    if (!targetFormat) {
      // 입력 파일 타입에 따라 기본 출력 형식 설정
      if (SUPPORTED_FORMATS.video.input.includes(inputExt)) {
        targetFormat = 'mp4';
      } else if (SUPPORTED_FORMATS.audio.input.includes(inputExt)) {
        targetFormat = 'mp3';
      } else if (SUPPORTED_FORMATS.image.input.includes(inputExt)) {
        targetFormat = 'jpg';
      }
    }
    
    const outputFilename = `result.${targetFormat}`;
    const outputPath = path.join(outputDir, outputFilename);

    // 변환 옵션 구성
    const convertOptions = {};
    
    if (resolution && resolution !== 'original') {
      convertOptions.resolution = resolution;
    }
    
    if (fps) {
      convertOptions.fps = Number(fps);
    }
    
    if (bitrate) {
      convertOptions.bitrate = bitrate;
    }
    
    if (quality && ['낮음', '보통', '높음'].includes(quality)) {
      convertOptions.quality = quality;
    }
    
    if (sampleRate) {
      convertOptions.sampleRate = Number(sampleRate);
    }
    
    if (channels) {
      convertOptions.channels = Number(channels);
    }
    
    if (codec) {
      convertOptions.codec = codec;
    }

    // 파일 변환 실행
    const result = await convertFile({
      input: inputPath,
      output: outputPath,
      format: targetFormat,
      ...convertOptions
    });

    // 변환된 파일 다운로드
    res.download(outputPath, outputFilename, (err) => {
      // 임시 파일 정리
      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.error('파일 정리 중 오류:', cleanupError);
      }
    });
  } catch (err) {
    console.error('변환 오류:', err);
    
    // 업로드된 파일 정리
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('업로드 파일 정리 중 오류:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      error: '변환 실패', 
      message: err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});