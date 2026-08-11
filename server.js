const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// SQLite DB Initialization
const db = new Database(path.join(__dirname, 'orders.db'));

// orders 테이블 생성
db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        imp_uid TEXT,
        merchant_uid TEXT NOT NULL,
        order_name TEXT NOT NULL,
        amount INTEGER NOT NULL,
        buyer_name TEXT NOT NULL,
        buyer_email TEXT,
        buyer_tel TEXT,
        pg_provider TEXT,
        status TEXT DEFAULT 'PAID',
        created_at TEXT
    );
`);

console.log('✅ SQLite DB (orders.db) 연동 및 테이블 준비 완료 (KST 타임존 적용)');

// API 1: 주문 정보 저장 (결제 성공 시 호출)
app.post('/api/orders', (req, res) => {
    try {
        const {
            imp_uid,
            merchant_uid,
            order_name,
            amount,
            buyer_name,
            buyer_email,
            buyer_tel,
            pg_provider,
            status
        } = req.body;

        if (!merchant_uid || !order_name || !amount || !buyer_name) {
            return res.status(400).json({ success: false, message: '필수 주문 정보가 누락되었습니다.' });
        }

        // 한국시간 (KST = Asia/Seoul) 보장 현재 시각 (YYYY-MM-DD HH:mm:ss)
        const nowKst = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' });

        const stmt = db.prepare(`
            INSERT INTO orders (imp_uid, merchant_uid, order_name, amount, buyer_name, buyer_email, buyer_tel, pg_provider, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            imp_uid || null,
            merchant_uid,
            order_name,
            amount,
            buyer_name,
            buyer_email || '',
            buyer_tel || '',
            pg_provider || 'kakao',
            status || 'PAID',
            nowKst
        );

        console.log(`💾 [SQLite 저장 완료] ID: ${result.lastInsertRowid}, 주문명: ${order_name}, 금액: ${amount}원, 한국시각(KST): ${nowKst}`);

        res.json({
            success: true,
            orderId: result.lastInsertRowid,
            message: '주문 정보가 SQLite DB에 정상 저장되었습니다.',
            created_at: nowKst
        });
    } catch (error) {
        console.error('❌ DB 저장 에러:', error);
        res.status(500).json({ success: false, message: 'DB 저장 실패', error: error.message });
    }
});

// API 2: 주문 목록 전체 조회
app.get('/api/orders', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM orders ORDER BY id DESC');
        const orders = stmt.all();
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'DB 조회 실패', error: error.message });
    }
});

// Server Listen
app.listen(PORT, () => {
    console.log(`🚀 서버가 실행되었습니다: http://localhost:${PORT}`);
});
