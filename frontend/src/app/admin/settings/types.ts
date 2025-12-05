export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  maxImageSize: number;
  defaultCurrency: string;
  taxRate: number;
  shippingFee: number;
}

export interface PaymentSettings {
  paymentMethods: {
    cod: boolean;
    vnpay: boolean;
    momo: boolean;
    banking: boolean;
  };
  vnpayConfig: {
    tmnCode: string;
    hashSecret: string;
    url: string;
  };
  momoConfig: {
    partnerCode: string;
    accessKey: string;
    secretKey: string;
  };
  bankingInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  emailNotifications: {
    orderConfirmation: boolean;
    orderStatusUpdate: boolean;
    newUserRegistration: boolean;
    passwordReset: boolean;
  };
}

export type SettingsTab = 'config' | 'payment' | 'email';

export interface Message {
  type: 'success' | 'error';
  text: string;
}
