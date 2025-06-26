// 지원하는 포맷 정보
let supportedFormats = {};

// DOM 요소들
const fileInput = document.getElementById('fileInput');
const outputFormatSelect = document.getElementById('outputFormat');
const fileInfo = document.getElementById('fileInfo');
const videoOptions = document.getElementById('videoOptions');
const audioOptions = document.getElementById('audioOptions');
const imageOptions = document.getElementById('imageOptions');
const convertForm = document.getElementById('convertForm');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const convertBtn = document.getElementById('convertBtn');

// 페이지 로드 시 지원하는 포맷 정보 가져오기
async function loadSupportedFormats() {
  try {
    const response = await fetch('/api/formats');
    supportedFormats = await response.json();
    populateOutputFormats();
  } catch (error) {
    console.error('포맷 정보 로드 실패:', error);
  }
}

// 출력 형식 옵션 채우기
function populateOutputFormats() {
  outputFormatSelect.innerHTML = '<option value="">변환할 형식을 선택하세요</option>';
  
  // 모든 지원하는 출력 형식을 추가
  const allFormats = [
    ...supportedFormats.video.output,
    ...supportedFormats.audio.output,
    ...supportedFormats.image.output
  ];
  
  allFormats.forEach(format => {
    const option = document.createElement('option');
    option.value = format;
    option.textContent = format.toUpperCase();
    outputFormatSelect.appendChild(option);
  });
}

// 파일 타입 감지
function detectFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  if (supportedFormats.video.input.includes(ext)) {
    return 'video';
  } else if (supportedFormats.audio.input.includes(ext)) {
    return 'audio';
  } else if (supportedFormats.image.input.includes(ext)) {
    return 'image';
  }
  
  return null;
}

// 파일 정보 표시
function showFileInfo(file) {
  const fileType = detectFileType(file.name);
  const size = (file.size / 1024 / 1024).toFixed(2);
  
  fileInfo.innerHTML = `
    <p><strong>파일명:</strong> ${file.name}</p>
    <p><strong>크기:</strong> ${size} MB</p>
    <p><strong>타입:</strong> ${fileType ? fileType.charAt(0).toUpperCase() + fileType.slice(1) : '지원하지 않는 형식'}</p>
  `;
  fileInfo.style.display = 'block';
  
  // 파일 타입에 따라 적절한 출력 형식 필터링
  filterOutputFormats(fileType);
}

// 출력 형식 필터링
function filterOutputFormats(inputType) {
  const options = outputFormatSelect.options;
  
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option.value === '') continue; // 기본 옵션은 항상 표시
    
    const outputType = detectFileType(`file.${option.value}`);
    let show = false;
    
    if (inputType === outputType) {
      show = true; // 같은 타입 내 변환
    } else if (inputType === 'video' && (outputType === 'image' || outputType === 'audio')) {
      show = true; // 비디오에서 이미지/오디오 추출
    }
    
    option.style.display = show ? '' : 'none';
  }
  
  // 첫 번째 표시되는 옵션 선택
  for (let i = 0; i < options.length; i++) {
    if (options[i].style.display !== 'none' && options[i].value !== '') {
      outputFormatSelect.value = options[i].value;
      break;
    }
  }
}

// 옵션 섹션 표시/숨김
function showOptionsForType(type) {
  // 모든 옵션 섹션 숨김
  videoOptions.style.display = 'none';
  audioOptions.style.display = 'none';
  imageOptions.style.display = 'none';
  
  // 선택된 타입에 따라 옵션 섹션 표시
  if (type === 'video') {
    videoOptions.style.display = 'block';
  } else if (type === 'audio') {
    audioOptions.style.display = 'block';
  } else if (type === 'image') {
    imageOptions.style.display = 'block';
  }
}

// 변환 옵션 수집
function collectConversionOptions() {
  const options = {};
  
  // 공통 옵션
  if (outputFormatSelect.value) {
    options.outputFormat = outputFormatSelect.value;
  }
  
  // 비디오 옵션
  const resolution = document.getElementById('resolution').value;
  const fps = document.getElementById('fps').value;
  const bitrate = document.getElementById('bitrate').value;
  const videoQuality = document.getElementById('videoQuality').value;
  
  if (resolution && resolution !== 'original') options.resolution = resolution;
  if (fps) options.fps = fps;
  if (bitrate) options.bitrate = bitrate;
  if (videoQuality) options.quality = videoQuality;
  
  // 오디오 옵션
  const sampleRate = document.getElementById('sampleRate').value;
  const channels = document.getElementById('channels').value;
  const audioQuality = document.getElementById('audioQuality').value;
  
  if (sampleRate) options.sampleRate = sampleRate;
  if (channels) options.channels = channels;
  if (audioQuality) options.quality = audioQuality;
  
  // 이미지 옵션
  const imageResolution = document.getElementById('imageResolution').value;
  const imageQuality = document.getElementById('imageQuality').value;
  
  if (imageResolution && imageResolution !== 'original') options.resolution = imageResolution;
  if (imageQuality) options.quality = imageQuality;
  
  return options;
}

// 변환 실행
async function convertFile(file, options) {
  const formData = new FormData();
  formData.append('file', file);
  
  // 옵션들을 FormData에 추가
  Object.keys(options).forEach(key => {
    if (options[key] !== undefined && options[key] !== '') {
      formData.append(key, options[key]);
    }
  });
  
  try {
    convertBtn.disabled = true;
    convertBtn.textContent = '변환 중...';
    
    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '변환 실패');
    }
    
    // 파일 다운로드
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;
    downloadLink.download = `converted.${options.outputFormat}`;
    
    // 결과 정보 표시
    const resultInfo = document.getElementById('resultInfo');
    resultInfo.innerHTML = `
      <p><strong>변환 완료!</strong></p>
      <p>파일 크기: ${(blob.size / 1024 / 1024).toFixed(2)} MB</p>
      <p>출력 형식: ${options.outputFormat.toUpperCase()}</p>
    `;
    
    resultDiv.style.display = 'block';
    errorDiv.style.display = 'none';
    
  } catch (error) {
    console.error('변환 오류:', error);
    showError(error.message);
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = '변환하기';
  }
}

// 오류 표시
function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorDiv.style.display = 'block';
  resultDiv.style.display = 'none';
}

// 이벤트 리스너들
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    showFileInfo(file);
  } else {
    fileInfo.style.display = 'none';
  }
});

outputFormatSelect.addEventListener('change', (e) => {
  const selectedFormat = e.target.value;
  if (selectedFormat) {
    const outputType = detectFileType(`file.${selectedFormat}`);
    showOptionsForType(outputType);
  }
});

convertForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const file = fileInput.files[0];
  if (!file) {
    showError('파일을 선택해주세요.');
    return;
  }
  
  if (!outputFormatSelect.value) {
    showError('출력 형식을 선택해주세요.');
    return;
  }
  
  const options = collectConversionOptions();
  await convertFile(file, options);
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  loadSupportedFormats();
});