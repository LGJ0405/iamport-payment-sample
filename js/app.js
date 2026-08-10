/**
 * PortOne (아임포트) 카카오페이 / 토스페이 결제 연동 바닐라 JS 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
    const payButtons = document.querySelectorAll('.btn-submit[data-pg]');

    payButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pgProvider = e.currentTarget.getAttribute('data-pg');
            handlePayment(pgProvider);
        });
    });
});

function handlePayment(selectedPg) {
    // 1. 설정 및 식별코드 검증
    const impCode = (typeof CONFIG !== 'undefined' && CONFIG.IMP_CODE) ? CONFIG.IMP_CODE : null;

    if (!impCode || impCode === 'YOUR_IMP_CODE_HERE') {
        showToast('PortOne 가맹점 식별코드(IMP_CODE)가 설정되지 않았습니다. config.js를 확인하세요.', 'error');
        return;
    }

    // 2. 폼 데이터 수집
    const orderName = document.getElementById('order-name').value.trim();
    const amountInput = document.getElementById('amount').value;
    const amount = parseInt(amountInput, 10);
    const buyerName = document.getElementById('buyer-name').value.trim();
    const buyerEmail = document.getElementById('buyer-email').value.trim();
    const buyerTel = document.getElementById('buyer-tel').value.trim();

    const pgDisplayName = selectedPg.includes('tosspay') ? '토스페이' : '카카오페이';

    if (!orderName) {
        showToast('주문 상품명을 입력해 주세요.', 'error');
        document.getElementById('order-name').focus();
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        showToast('올바른 결제 금액을 입력해 주세요.', 'error');
        document.getElementById('amount').focus();
        return;
    }

    if (!buyerName) {
        showToast('구매자 성함을 입력해 주세요.', 'error');
        document.getElementById('buyer-name').focus();
        return;
    }

    // 3. PortOne(IMP) 객체 확인 및 초기화
    if (!window.IMP) {
        showToast('포트원(아임포트) SDK를 로드하지 못했습니다.', 'error');
        return;
    }

    const IMP = window.IMP;
    IMP.init(impCode);

    // 4. 결제 요청 데이터 생성
    const merchantUid = `merchant_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payData = {
        merchant_uid: merchantUid,
        name: orderName,
        amount: amount,
        buyer_email: buyerEmail || 'customer@example.com',
        buyer_name: buyerName,
        buyer_tel: buyerTel || '010-0000-0000'
    };

    // 토스페이 선택 시 포트원 공식 AI 샘플 규격 적용: pay_method: 'tosspay' & channelKey
    if (selectedPg.includes('tosspay')) {
        payData.pay_method = 'tosspay';
        if (typeof CONFIG !== 'undefined' && CONFIG.tosspay_v2) {
            payData.channelKey = CONFIG.tosspay_v2;
        } else {
            payData.pg = 'tosspay';
        }
    } else {
        payData.pay_method = 'card';
        payData.pg = 'kakao';
    }

    showToast(`${pgDisplayName} 결제 모듈을 호출합니다...`, 'info');

    // 5. 결제 요청 실행
    IMP.request_pay(payData, (rsp) => {
        console.log('[포트원 결제 응답 전체]', rsp);

        // rsp.success가 true이거나, 에러가 없고 imp_uid가 성공적으로 수신된 경우 성공 처리
        const isSuccess = rsp.success === true || Boolean(rsp.imp_uid && !rsp.error_code && !rsp.error_msg);

        if (isSuccess) {
            console.log(`[결제 성공] imp_uid: ${rsp.imp_uid}, merchant_uid: ${rsp.merchant_uid}`);
            showToast('결제가 성공적으로 완료되었습니다!', 'success');
        } else {
            console.error('결제 실패 상세:', rsp);
            const errorMsg = rsp.error_msg || rsp.error_code || '알 수 없는 결제 오류가 발생했습니다.';
            showToast(`결제 실패: ${errorMsg}`, 'error');
        }
    });
}

/**
 * 모던 UI 토스트 메시지 렌더링 함수
 */
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
