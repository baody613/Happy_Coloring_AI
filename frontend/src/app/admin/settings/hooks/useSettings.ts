import { useState, useCallback } from 'react';
import { adminAPI } from '@/lib/adminAPI';
import { SystemSettings, PaymentSettings, EmailSettings, SettingsTab, Message } from '../types';

export const useSettings = () => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Happy Coloring AI',
    siteDescription: 'Nền tảng tô màu theo số với AI',
    maintenanceMode: false,
    allowRegistration: true,
    maxImageSize: 10,
    defaultCurrency: 'VND',
    taxRate: 10,
    shippingFee: 30000,
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    paymentMethods: {
      cod: true,
      vnpay: false,
      momo: false,
      banking: true,
    },
    vnpayConfig: {
      tmnCode: '',
      hashSecret: '',
      url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    },
    momoConfig: {
      partnerCode: '',
      accessKey: '',
      secretKey: '',
    },
    bankingInfo: {
      bankName: 'Vietcombank',
      accountNumber: '',
      accountName: '',
    },
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'Happy Coloring AI',
    emailNotifications: {
      orderConfirmation: true,
      orderStatusUpdate: true,
      newUserRegistration: true,
      passwordReset: true,
    },
  });

  const loadSettings = useCallback(async (activeTab: SettingsTab) => {
    try {
      let response;

      switch (activeTab) {
        case 'config':
          response = await adminAPI.settings.getSystemSettings();
          if (response.success) {
            setSystemSettings(response.data);
          }
          break;
        case 'payment':
          response = await adminAPI.settings.getPaymentSettings();
          if (response.success) {
            setPaymentSettings(response.data);
          }
          break;
        case 'email':
          response = await adminAPI.settings.getEmailSettings();
          if (response.success) {
            setEmailSettings(response.data);
          }
          break;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({ type: 'error', text: 'Lỗi khi tải cài đặt!' });
    }
  }, []);

  const saveSettings = useCallback(
    async (activeTab: SettingsTab) => {
      setSaving(true);
      setMessage(null);

      try {
        let response;

        switch (activeTab) {
          case 'config':
            response = await adminAPI.settings.updateSystemSettings(systemSettings);
            break;
          case 'payment':
            response = await adminAPI.settings.updatePaymentSettings(paymentSettings);
            break;
          case 'email':
            response = await adminAPI.settings.updateEmailSettings(emailSettings);
            break;
        }

        if (response?.success) {
          setMessage({ type: 'success', text: 'Lưu cài đặt thành công!' });
          setTimeout(() => setMessage(null), 3000);
        } else {
          setMessage({ type: 'error', text: 'Lỗi khi lưu cài đặt!' });
        }
      } catch (error: any) {
        console.error('Error saving settings:', error);
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Lỗi khi lưu cài đặt!',
        });
      } finally {
        setSaving(false);
      }
    },
    [systemSettings, paymentSettings, emailSettings]
  );

  return {
    systemSettings,
    setSystemSettings,
    paymentSettings,
    setPaymentSettings,
    emailSettings,
    setEmailSettings,
    saving,
    message,
    setMessage,
    loadSettings,
    saveSettings,
  };
};
