import Razorpay from 'razorpay';

export const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const razorpay = getRazorpayInstance();
export default razorpay;
