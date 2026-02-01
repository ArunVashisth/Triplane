import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reuse container styles

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(60);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length < 6) {
            return setError('Please enter the full 6-digit OTP');
        }

        setLoading(true);
        setError('');
        try {
            const response = await authAPI.verifyOTP({ email, otp: otpValue });
            login(response.data.token, response.data.user);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setResending(true);
        setError('');
        try {
            await authAPI.resendOTP({ email });
            setTimer(60);
            alert('New OTP has been sent to your email');
        } catch (err) {
            setError('Failed to resend OTP');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Verify Email</h2>
                    <p>We've sent a 6-digit code to <strong>{email}</strong></p>
                </div>

                {error && <div className="error-message" style={{ color: 'var(--accent)', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="otp-input-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="otp-field"
                                style={{
                                    width: '45px',
                                    height: '55px',
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    fontWeight: '800',
                                    borderRadius: '12px',
                                    border: '1.5px solid var(--border-color)',
                                    background: 'var(--bg-light)',
                                    color: 'var(--text-dark)'
                                }}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Didn't receive the code?{' '}
                        <button
                            onClick={handleResend}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: timer > 0 ? 'var(--text-muted)' : 'var(--accent)',
                                fontWeight: '800',
                                cursor: timer > 0 ? 'default' : 'pointer',
                                padding: '0',
                                marginLeft: '5px'
                            }}
                        >
                            {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;
