# 💳 iamport-payment-sample

PortOne(구 아임포트) SDK 기반의 자바스크립트 결제 체크아웃 및 Express/SQLite 백엔드 주문 정보 저장 연동 예제 프로젝트입니다.

---

## ✨ 주요 특징

- **Pure Vanilla JS (ES6+)**: 외부 UI 프레임워크 없이 순수 자바스크립트로 전면 구현
- **PortOne 최신 SDK 연동**: 카카오페이(🟡 `kakao`) 및 토스페이(🔵 `tosspay_v2` / `channelKey`) 결제창 호출 지원
- **SQLite DB 자동 연동 (Express)**: 결제 성공 시 주문 정보(`imp_uid`, `merchant_uid`, 금액, 구매자 정보 등)를 SQLite DB에 자동 저장을 위한 REST API 탑재
- **주문 내역 모니터링 UI**: 실시간 저장된 주문 데이터를 쉽게 확인할 수 있는 대시보드 제공 (`/orders.html`)

---

## 📂 프로젝트 구조

```text
html_pay/
├── index.html                  # 결제 체크아웃 메인 화면
├── pay.html                    # 결제 체크아웃 예제 화면
├── orders.html                 # SQLite DB 주문 내역 실시간 모니터링 화면
├── server.js                   # Node.js Express + SQLite (better-sqlite3) API 서버
├── config.example.js           # 환경 설정 예시 파일 (식별코드 및 채널키 템플릿)
├── config.js                   # [Git제외] 실제 로컬 식별코드 보관 파일
├── css/
│   └── style.css               # 모던 스타일시트
├── js/
│   └── app.js                  # PortOne 결제 요청 & 백엔드 DB 저장 통신 모듈
└── docs/
    ├── api-documentation.md    # Express & SQLite REST API 명세서
    └── payment-integration-guide.md # 카카오페이 vs 토스페이 연동 비교 가이드
```

---

## 🚀 사용법 및 서버 실행

1. **설정 파일 준비**  
   `config.example.js` 파일의 복사본을 만들어 `config.js` 파일로 이름을 변경하고, 본인의 식별코드 및 채널키를 입력합니다.
   ```bash
   cp config.example.js config.js
   ```

2. **패키지 설치 및 백엔드 서버 구동**
   ```bash
   npm install
   npm start
   ```

3. **테스트 페이지 접속**
   - **결제 테스트**: [http://localhost:3000](http://localhost:3000)
   - **DB 주문 내역 조회**: [http://localhost:3000/orders.html](http://localhost:3000/orders.html)