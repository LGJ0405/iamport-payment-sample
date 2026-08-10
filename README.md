# 💳 iamport-payment-sample (Modernized v2)

PortOne(구 아임포트) SDK 기반의 순수 자바스크립트(Vanilla JS) 결제 체크아웃 웹 예제 프로젝트입니다.

---

## ✨ 주요 특징 및 리팩토링

- **Pure Vanilla JS (ES6+)**: 외부 라이브러리(jQuery) 의존성을 완전 제거
- **최신 PortOne SDK V1 연동**: 최신 CDN 스크립트(`https://cdn.iamport.kr/v1/iamport.js`) 적용
- **간편 결제 다변화**: 🟡 **카카오페이** (`kakao`) 및 🔵 **토스페이** (`tosspay_v2` / `channelKey`) 연동 지원
- **Modern UI & Responsive Design**: 글래스모피즘(Glassmorphism), 구글 폰트(Outfit/Noto Sans KR), 반응형 카드 컴포넌트, 모던 토스트 팝업 알림 지원

---

## 🚀 사용법

1. `config.example.js` 파일의 복사본을 만들어 `config.js` 파일로 이름을 변경합니다.
   ```bash
   cp config.example.js config.js
   ```
2. `config.js` 파일 내의 값들을 본인의 포트원 가맹점 식별코드 및 채널키로 수정합니다.
   ```javascript
   const CONFIG = {
       IMP_CODE: 'impXXXXXXXX', // 본인의 아임포트 가맹점 식별코드
       tosspay_v2: 'channel-key-XXXXXXXX-XXXX' // (선택) 포트원 토스페이 채널키
   };
   ```
3. `index.html` 또는 `pay.html`을 브라우저로 열어 테스트합니다.