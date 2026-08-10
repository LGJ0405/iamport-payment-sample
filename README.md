# 💳 iamport-payment-sample (Legacy Archive)

HTML, JavaScript(jQuery) 및 아임포트(PortOne) SDK를 이용한 결제 연동 코드 아카이빙 저장소입니다.

> 📜 **Original Blog Post**: [개발 블로그 포스팅 기록](https://blog.naver.com/rlfwls03/222358776174)

---

## 🚀 주요 기능

- **결제 연동 (`pay.html`)**: 아임포트 SDK를 활용한 카카오페이 결제 요청 예제

---

## 🔒 설정 및 사용법

1. `config.example.js` 파일의 복사본을 만들어 `config.js` 파일로 이름을 변경합니다.
   ```bash
   cp config.example.js config.js
   ```
2. `config.js` 파일 내의 `IMP_CODE` 값을 본인의 아임포트(포트원) 가맹점 식별코드로 수정합니다.
   ```javascript
   const CONFIG = {
       IMP_CODE: 'impXXXXXXXX' // 본인의 아임포트 가맹점 식별코드
   };
   ```
3. `pay.html`을 브라우저로 열어 테스트합니다.