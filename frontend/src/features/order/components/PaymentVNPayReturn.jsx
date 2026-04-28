import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentVNPayReturn = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get('vnp_ResponseCode');
    const orderId = params.get('vnp_TxnRef');
    const transactionId = params.get('vnp_TransactionNo');

    if (!orderId) {
      navigate('/');
      return;
    }

    if (code === '00') {
      navigate(`/payment/success?orderId=${orderId}&transactionId=${transactionId}`);
    } else {
      navigate(`/payment/failure?orderId=${orderId}&code=${code}`);
    }
  }, []);

  return <div>Đang xử lý thanh toán...</div>;
};

export default PaymentVNPayReturn;