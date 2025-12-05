import React from 'react';
import { EmailSettings } from '../types';

interface EmailConfigTabProps {
  settings: EmailSettings;
  onUpdate: (settings: EmailSettings) => void;
}

export const EmailConfigTab: React.FC<EmailConfigTabProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cài Đặt Email & Thông Báo</h2>

      {/* SMTP Config */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-4">Cấu Hình SMTP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="SMTP Host"
            type="text"
            value={settings.smtpHost}
            onChange={(value) => onUpdate({ ...settings, smtpHost: value })}
          />
          <InputField
            label="SMTP Port"
            type="number"
            value={settings.smtpPort.toString()}
            onChange={(value) => onUpdate({ ...settings, smtpPort: parseInt(value) })}
          />
          <InputField
            label="SMTP User"
            type="email"
            value={settings.smtpUser}
            onChange={(value) => onUpdate({ ...settings, smtpUser: value })}
          />
          <InputField
            label="SMTP Password"
            type="password"
            value={settings.smtpPassword}
            onChange={(value) => onUpdate({ ...settings, smtpPassword: value })}
          />
          <InputField
            label="Email Gửi Đi"
            type="email"
            value={settings.fromEmail}
            onChange={(value) => onUpdate({ ...settings, fromEmail: value })}
          />
          <InputField
            label="Tên Người Gửi"
            type="text"
            value={settings.fromName}
            onChange={(value) => onUpdate({ ...settings, fromName: value })}
          />
        </div>
      </div>

      {/* Email Notifications */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-4">Loại Thông Báo Email</h3>
        <div className="space-y-3">
          <NotificationOption
            label="📧 Xác nhận đơn hàng"
            checked={settings.emailNotifications.orderConfirmation}
            onChange={(checked) =>
              onUpdate({
                ...settings,
                emailNotifications: { ...settings.emailNotifications, orderConfirmation: checked },
              })
            }
          />
          <NotificationOption
            label="📦 Cập nhật trạng thái đơn hàng"
            checked={settings.emailNotifications.orderStatusUpdate}
            onChange={(checked) =>
              onUpdate({
                ...settings,
                emailNotifications: { ...settings.emailNotifications, orderStatusUpdate: checked },
              })
            }
          />
          <NotificationOption
            label="👤 Đăng ký tài khoản mới"
            checked={settings.emailNotifications.newUserRegistration}
            onChange={(checked) =>
              onUpdate({
                ...settings,
                emailNotifications: {
                  ...settings.emailNotifications,
                  newUserRegistration: checked,
                },
              })
            }
          />
          <NotificationOption
            label="🔑 Đặt lại mật khẩu"
            checked={settings.emailNotifications.passwordReset}
            onChange={(checked) =>
              onUpdate({
                ...settings,
                emailNotifications: { ...settings.emailNotifications, passwordReset: checked },
              })
            }
          />
        </div>
      </div>

      {/* Gmail Guide */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Hướng dẫn cấu hình Gmail</h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Bật xác thực 2 bước cho tài khoản Gmail</li>
          <li>Tạo App Password tại: myaccount.google.com/apppasswords</li>
          <li>Sử dụng App Password thay vì mật khẩu Gmail thông thường</li>
          <li>SMTP Host: smtp.gmail.com, Port: 587</li>
        </ol>
      </div>
    </div>
  );
};

// Helper Components
interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

interface NotificationOptionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const NotificationOption: React.FC<NotificationOptionProps> = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
      <span className="text-gray-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
    </div>
  );
};
