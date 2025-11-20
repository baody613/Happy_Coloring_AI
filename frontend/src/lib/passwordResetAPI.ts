import api from './api';

export const passwordResetAPI = {
  // Gửi mã OTP đến email
  sendCode: async (email: string) => {
    const response = await api.post('/password-reset/send-code', { email });
    return response.data;
  },

  // Xác thực mã OTP
  verifyCode: async (email: string, code: string) => {
    const response = await api.post('/password-reset/verify-code', { email, code });
    return response.data;
  },

  // Đặt lại mật khẩu
  resetPassword: async (email: string, code: string, newPassword: string) => {
    const response = await api.post('/password-reset/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  },
};
