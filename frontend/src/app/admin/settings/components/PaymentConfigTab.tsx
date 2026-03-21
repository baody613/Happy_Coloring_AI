import React from "react";
import { PaymentSettings } from "../types";

interface PaymentConfigTabProps {
  settings: PaymentSettings;
  onUpdate: (settings: PaymentSettings) => void;
}

export const PaymentConfigTab: React.FC<PaymentConfigTabProps> = ({
  settings,
  onUpdate,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Cài Đặt Thanh Toán
      </h2>

      {/* Payment Methods */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-4">
          Phương Thức Thanh Toán
        </h3>
        <div className="space-y-3">
          <PaymentMethodOption
            label="💵 Thanh toán khi nhận hàng (COD)"
            checked={settings.paymentMethods.cod}
            onChange={(checked) =>
              onUpdate({
                ...settings,
                paymentMethods: { ...settings.paymentMethods, cod: checked },
              })
            }
          />
          <PaymentMethodOption
            label="💳 VNPay"
            checked={settings.paymentMethods.vnpay}
            onChange={(checked) =>
              onUpdate({
                ...settings,
                paymentMethods: { ...settings.paymentMethods, vnpay: checked },
              })
            }
          />
          <PaymentMethodOption
            label="📱 MoMo"
            checked={settings.paymentMethods.momo}
            onChange={(checked) =>
              onUpdate({
                ...settings,
                paymentMethods: { ...settings.paymentMethods, momo: checked },
              })
            }
          />
          <PaymentMethodOption
            label="🏦 Chuyển khoản ngân hàng"
            checked={settings.paymentMethods.banking}
            onChange={(checked) =>
              onUpdate({
                ...settings,
                paymentMethods: {
                  ...settings.paymentMethods,
                  banking: checked,
                },
              })
            }
          />
        </div>
      </div>

      {/* VNPay Config */}
      {settings.paymentMethods.vnpay && (
        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Cấu Hình VNPay</h3>
          <div className="space-y-4">
            <InputField
              label="TMN Code"
              type="text"
              value={settings.vnpayConfig.tmnCode}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  vnpayConfig: { ...settings.vnpayConfig, tmnCode: value },
                })
              }
            />
            <InputField
              label="Hash Secret"
              type="password"
              value={settings.vnpayConfig.hashSecret}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  vnpayConfig: { ...settings.vnpayConfig, hashSecret: value },
                })
              }
            />
            <InputField
              label="VNPay URL"
              type="text"
              value={settings.vnpayConfig.url}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  vnpayConfig: { ...settings.vnpayConfig, url: value },
                })
              }
            />
          </div>
        </div>
      )}

      {/* MoMo Config */}
      {settings.paymentMethods.momo && (
        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Cấu Hình MoMo</h3>
          <div className="space-y-4">
            <InputField
              label="Partner Code"
              type="text"
              value={settings.momoConfig.partnerCode}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  momoConfig: { ...settings.momoConfig, partnerCode: value },
                })
              }
            />
            <InputField
              label="Access Key"
              type="text"
              value={settings.momoConfig.accessKey}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  momoConfig: { ...settings.momoConfig, accessKey: value },
                })
              }
            />
            <InputField
              label="Secret Key"
              type="password"
              value={settings.momoConfig.secretKey}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  momoConfig: { ...settings.momoConfig, secretKey: value },
                })
              }
            />
          </div>
        </div>
      )}

      {/* Banking Info */}
      {settings.paymentMethods.banking && (
        <div className="border border-gray-200 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">
            Thông Tin Ngân Hàng
          </h3>
          <div className="space-y-4">
            <InputField
              label="Tên Ngân Hàng"
              type="text"
              value={settings.bankingInfo.bankName}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  bankingInfo: { ...settings.bankingInfo, bankName: value },
                })
              }
            />
            <InputField
              label="Số Tài Khoản"
              type="text"
              value={settings.bankingInfo.accountNumber}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  bankingInfo: {
                    ...settings.bankingInfo,
                    accountNumber: value,
                  },
                })
              }
            />
            <InputField
              label="Tên Chủ Tài Khoản"
              type="text"
              value={settings.bankingInfo.accountName}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  bankingInfo: { ...settings.bankingInfo, accountName: value },
                })
              }
            />
            <InputField
              label="URL Ảnh Mã QR"
              type="text"
              value={settings.bankingInfo.qrImageUrl || ""}
              onChange={(value) =>
                onUpdate({
                  ...settings,
                  bankingInfo: { ...settings.bankingInfo, qrImageUrl: value },
                })
              }
            />

            {settings.bankingInfo.qrImageUrl && (
              <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">
                  Xem trước mã QR chuyển khoản
                </p>
                <img
                  src={settings.bankingInfo.qrImageUrl}
                  alt="QR chuyển khoản"
                  className="w-56 h-56 object-contain rounded-lg border border-gray-200 bg-white"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
interface PaymentMethodOptionProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PaymentMethodOption: React.FC<PaymentMethodOptionProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between">
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

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};
