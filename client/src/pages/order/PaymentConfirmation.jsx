import React, { useEffect,useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import { Typography, Button } from 'antd';

const { Title } = Typography;

const PaymentConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paymentMessage, setPaymentMessage] = useState('');

    useEffect(() => {
        // Simulate successful payment confirmation process
        // Redirect to home page after 3 seconds
        const searchParams = new URLSearchParams(location.search);
        const paymentStatus = searchParams.get('vnp_ResponseCode');
        if (paymentStatus === '00') {
            setPaymentMessage('Payment successful!');
            // Optional: You can clear local storage or perform other cleanup here
        } else {
            setPaymentMessage('Payment failed.');
        }

        setTimeout(() => {
            navigate('/');
        }, 3000);
    }, [location.search,navigate]);

    return (
        <div style={{ padding: '24px', textAlign: 'center' }}>
            <Title level={2}>Payment Confirmation</Title>
            <p>{paymentMessage}</p>
            <Button type="primary" onClick={() => history.push('/')}>
                Return to Home
            </Button>
        </div>
    );
};

export default PaymentConfirmation;