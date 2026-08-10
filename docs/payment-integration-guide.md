# 💳 PortOne (Iamport) 카카오페이 vs 토스페이 연동 비교 가이드

PortOne(구 아임포트) SDK를 통한 **카카오페이(Kakaopay)** 및 **토스페이(Tosspay)** 연동 시 기술적 차이점과 파라미터 규격을 정리한 문서입니다.

---

## 📊 1. 핵심 차이점 요약

| 항목 | 🟡 카카오페이 (Kakaopay) | 🔵 토스페이 (Tosspay) |
| :--- | :--- | :--- |
| **기본 탑재 여부** | 포트원 가입 시 **기본 디폴트 PG로 자동 활성화** | 포트원 콘솔에서 **테스트 채널 추가 후 채널키(`channelKey`)** 발급 필요 |
| **식별 파라미터** | `pg: 'kakao'` | `channelKey: 'YOUR_TOSSPAY_CHANNEL_KEY'` (또는 `pg: 'tosspay'`) |
| **지불 수단 (`pay_method`)** | `card` 사용 가능 | `tosspay` 또는 `EASY_PAY` 필수 (`card` 입력 시 규칙 위반 에러) |
| **PC 결제 승인 방식** | 화면의 **QR코드**를 카카오톡 카메라로 스캔하여 승인 | **전화번호 입력 또는 QR코드** 스캔 후 토스 앱에서 승인 |
| **콜백 응답 (`rsp`) 객체** | `rsp.success === true` 리턴 | `rsp.success`가 `undefined`로 전달될 수 있어 `imp_uid` 기반 성공 판별 필요 |

---

## 🟡 2. 카카오페이 (Kakaopay) 연동 규격

카카오페이는 포트원 가맹점 식별코드(`IMP_CODE`)만 가지고 별도의 복잡한 세팅 없이 즉시 테스트 결제창 호출이 가능합니다.

```javascript
IMP.request_pay({
    pg: 'kakao',
    pay_method: 'card',
    merchant_uid: 'merchant_' + new Date().getTime(),
    name: '주문 상품명',
    amount: 13000,
    buyer_name: '홍길동',
    buyer_tel: '010-1234-5678'
}, function (rsp) {
    if (rsp.success) {
        console.log('결제 성공 imp_uid:', rsp.imp_uid);
    }
});
```

---

## 🔵 3. 토스페이 (Tosspay) 연동 규격

토스페이는 포트원 콘솔([admin.portone.io](https://admin.portone.io))의 `[결제 연동] -> [채널 관리]`에서 토스페이 테스트 채널을 생성한 뒤 발급받은 **`channelKey`**를 전달하여 연동합니다. (실제 채널키는 `config.js` 등 외부 환경변수로 관리합니다.)

```javascript
IMP.request_pay({
    channelKey: CONFIG.tosspay_v2, // 포트원 콘솔에서 발급받은 채널키 (config.js 내 관리)
    pay_method: 'tosspay', // 'tosspay' 또는 'EASY_PAY' ('card' 사용 불가)
    merchant_uid: 'merchant_' + new Date().getTime(),
    name: '주문 상품명',
    amount: 13000,
    buyer_name: '홍길동',
    buyer_tel: '010-1234-5678'
}, function (rsp) {
    // rsp.success가 undefined일 수 있으므로 imp_uid 존재 여부로 판별
    const isSuccess = rsp.success === true || Boolean(rsp.imp_uid && !rsp.error_code && !rsp.error_msg);
    
    if (isSuccess) {
        console.log('결제 성공 imp_uid:', rsp.imp_uid);
    }
});
```

---

## 💡 4. 결제 콜백 성공 판별 팁 (Safety Guard)

특정 PG사나 채널키 연동 방식에서는 `rsp.success` 속성이 `undefined`로 전달될 수 있습니다. 이를 예방하기 위해 아래와 같이 안전한 검증 판별식을 사용하는 것을 권장합니다:

```javascript
IMP.request_pay(payData, function (rsp) {
    // rsp.success 판별 보완
    const isSuccess = rsp.success === true || Boolean(rsp.imp_uid && !rsp.error_code && !rsp.error_msg);

    if (isSuccess) {
        showToast('결제가 성공적으로 완료되었습니다!', 'success');
    } else {
        const errorMsg = rsp.error_msg || rsp.error_code || '알 수 없는 결제 오류가 발생했습니다.';
        showToast('결제 실패: ' + errorMsg, 'error');
    }
});
```
