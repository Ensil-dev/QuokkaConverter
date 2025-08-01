# AGENT 지침

- 모든 최종 답변과 PR 요약(Body)은 한국어로 작성합니다.
- 코드나 문서를 인용할 때는 `F:<경로>†L<시작>(-L<끝>)` 형식을 사용합니다.
- lint와 type에러가 없는지 점검하고, 에러가 있다면 해결하도록 합니다.
- 프로젝트의 메인이되는 폴더는 QuokkaConverter/next-converter 입니다.
- QuokkaConverter/public, QuokkaConverter/server 폴더는 로컬에서 이미지/오디오/동영상 파일을 변환할 수 있도록하는 초기 샘플 웹앱이고, 변경을 허용하지 않습니다.
- 기존 설정되어있는 CSS 설정은 절대 임의로 바꾸지 말고 사용자에게 바꿀지 묻도록 합니다
- CSS 설정을 바꿔야한다면 이전과 UI가 완전히 동일하도록 작성합니다.
- 커밋 메시지는 한글로 간단명료하게 작성합니다.
  - feature: 블라블라
    - 기능이 추가된 경우
  - fix: 블라블라
    - 오류나 버그를 수정한 경우
  - refactor: 블라블라
    - 기능이 추가되거나 수정되진 않았는데, 코드가 개선됭 경우
  - chore: 블라블라
    - 인프라 설정이나 환결 설정이나 프로젝트 설정과 관련된 부분
  - test: 블라블라
    - 테스트 코드를 추가하거나 수정한 경우
- npm start와 npm run build를 통해 빌드가 정상적으로 동작하는지 확인합니다.
  - 이 때 npm install --legacy-peer-deps 옵션을 사용합니다.
- 서버 콘솔에서는 경고가 발생하는지 확인합니다.
- 기타 일반 지침은 상위 규칙을 따릅니다.
