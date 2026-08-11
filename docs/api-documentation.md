# 🗄️ PortOne Payment & SQLite Order API Specification

Express 및 SQLite (`better-sqlite3`) 기반 결제 주문 정보 관리 백엔드 API 문서입니다.

---

## 💾 1. SQLite Database Schema (`orders.db`)

주문 정보가 저장되는 `orders` 테이블 스키마 명세입니다.

```sql
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    imp_uid TEXT,                            -- PortOne 결제 고유번호 (예: imp_123456789)
    merchant_uid TEXT NOT NULL,              -- 가맹점 주문번호 (예: merchant_1723351234_99)
    order_name TEXT NOT NULL,                -- 주문 상품명
    amount INTEGER NOT NULL,                 -- 결제 금액 (KRW)
    buyer_name TEXT NOT NULL,                -- 구매자 이름
    buyer_email TEXT,                        -- 구매자 이메일
    buyer_tel TEXT,                          -- 구매자 전화번호
    pg_provider TEXT,                        -- 결제 PG사 ('kakao', 'tosspay' 등)
    status TEXT DEFAULT 'PAID',              -- 결제 상태 ('PAID', 'CANCELLED' 등)
    created_at DATETIME DEFAULT (datetime('now', '+9 hours')) -- 주문 생성 일시 (KST = UTC+9)
);
```

---

## 🚀 2. REST API Endpoints

### 1) 주문 정보 저장 (`POST /api/orders`)
결제 성공 후 결제 응답 결과(`rsp`)를 수신하여 SQLite DB에 신규 주문 정보를 저장합니다.

- **URL**: `/api/orders`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "imp_uid": "imp_370995335149",
  "merchant_uid": "merchant_1723351234_999",
  "order_name": "프리미엄 멤버십 (1개월)",
  "amount": 13000,
  "buyer_name": "홍길동",
  "buyer_email": "customer@example.com",
  "buyer_tel": "010-1234-5678",
  "pg_provider": "kakao",
  "status": "PAID"
}
```

#### Response Success (`200 OK`)
```json
{
  "success": true,
  "orderId": 1,
  "message": "주문 정보가 SQLite DB에 정상 저장되었습니다."
}
```

---

### 2) 주문 목록 전체 조회 (`GET /api/orders`)
저장된 전체 주문 목록을 최신순(`created_at DESC`)으로 조회합니다.

- **URL**: `/api/orders`
- **Method**: `GET`

#### Response Success (`200 OK`)
```json
{
  "success": true,
  "count": 1,
  "orders": [
    {
      "id": 1,
      "imp_uid": "imp_370995335149",
      "merchant_uid": "merchant_1723351234_999",
      "order_name": "프리미엄 멤버십 (1개월)",
      "amount": 13000,
      "buyer_name": "홍길동",
      "buyer_email": "customer@example.com",
      "buyer_tel": "010-1234-5678",
      "pg_provider": "kakao",
      "status": "PAID",
      "created_at": "2026-08-11 14:27:35"
    }
  ]
}
```
