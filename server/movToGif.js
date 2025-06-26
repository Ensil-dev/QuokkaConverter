import { execSync, spawnSync } from 'child_process';
import fs from 'fs';

function check_dependencies() {
  const missing = [];
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); } catch { missing.push('ffmpeg'); }
  try { execSync('gifsicle --version', { stdio: 'ignore' }); } catch { missing.push('gifsicle'); }
  if (missing.length > 0) {
    throw new Error('다음 도구가 필요합니다: ' + missing.join(', '));
  }
}

function apply_quality_preset(preset, state) {
  switch (preset) {
    case '낮음':
      state.framerate = 8; state.optimize = 1;
      if (!state.width && !state.scale) state.width = 600;
      break;
    case '보통':
      state.framerate = 10; state.optimize = 2;
      break;
    case '높음':
      state.framerate = 15; state.optimize = 3;
      if (!state.width && !state.scale) state.width = 1200;
      break;
    default:
      throw new Error(`알 수 없는 품질 설정: ${preset}`);
  }
}

export async function movToGif(options) {
  const state = { ...options };
  if (state.loop === undefined) state.loop = 0;
  if (!state.input) throw new Error('입력 파일이 지정되지 않았습니다.');
  if (!fs.existsSync(state.input)) throw new Error(`입력 파일을 찾을 수 없습니다: ${state.input}`);
  if (!state.output) {
    const base = state.input.replace(/\.[^.]+$/, '');
    state.output = `${base}.gif`;
  }
  if (state.quality) apply_quality_preset(state.quality, state);
  if (isNaN(state.framerate) || state.framerate < 1 || state.framerate > 60) throw new Error('프레임레이트는 1~60 사이여야 합니다.');
  if (isNaN(state.loop) || state.loop < 0) throw new Error('루프는 0 이상의 숫자여야 합니다.');
  if (isNaN(state.optimize) || state.optimize < 1 || state.optimize > 3) throw new Error('최적화는 1~3 중 하나여야 합니다.');
  if (state.delay !== undefined && (isNaN(state.delay) || state.delay < 0)) throw new Error('지연시간은 숫자여야 합니다.');

  check_dependencies();

  let filters = '';
  if (state.scale) filters = `scale=${state.scale}`;
  else if (state.width) filters = `scale=${state.width}:-1`;

  const ffmpeg = spawnSync('ffmpeg', [
    '-i', state.input,
    '-r', String(state.framerate),
    ...(filters ? ['-vf', filters] : []),
    '-f', 'gif', '-an', '-loop', '0', '-'
  ], { encoding: 'buffer', maxBuffer: 1024 * 1024 * 100 });
  if (ffmpeg.status !== 0) throw new Error(ffmpeg.stderr.toString());
  const gifsicle = spawnSync('gifsicle', [
    `--optimize=${state.optimize}`,
    ...(state.delay !== undefined ? [`--delay=${state.delay}`] : []),
    ...(state.loop !== undefined ? [`--loopcount=${state.loop}`] : [])
  ], { input: ffmpeg.stdout, encoding: 'buffer', maxBuffer: 1024 * 1024 * 100 });
  if (gifsicle.status !== 0) throw new Error(gifsicle.stderr.toString());
  fs.writeFileSync(state.output, gifsicle.stdout);
  return {
    output: state.output,
    size: fs.statSync(state.output).size
  };
} 