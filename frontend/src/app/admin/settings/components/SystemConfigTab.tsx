import React from 'react';
import { SystemSettings } from '../types';

interface SystemConfigTabProps {
  settings: SystemSettings;
  onUpdate: (settings: SystemSettings) => void;
}

export const SystemConfigTab: React.FC<SystemConfigTabProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cấu Hình Hệ Thống</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tên Website</label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => onUpdate({ ...settings, siteName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mô Tả</label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => onUpdate({ ...settings, siteDescription: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kích Thước Ảnh Tối Đa (MB)
          </label>
          <input
            type="number"
            value={settings.maxImageSize}
            onChange={(e) => onUpdate({ ...settings, maxImageSize: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Đơn Vị Tiền Tệ</label>
          <select
            value={settings.defaultCurrency}
            onChange={(e) => onUpdate({ ...settings, defaultCurrency: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="VND">VND - Việt Nam Đồng</option>
            <option value="USD">USD - US Dollar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thuế VAT (%)</label>
          <input
            type="number"
            value={settings.taxRate}
            onChange={(e) => onUpdate({ ...settings, taxRate: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phí Vận Chuyển (VND)
          </label>
          <input
            type="number"
            value={settings.shippingFee}
            onChange={(e) => onUpdate({ ...settings, shippingFee: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        <ToggleOption
          title="Chế Độ Bảo Trì"
          description="Tắt website để bảo trì, chỉ admin mới truy cập được"
          checked={settings.maintenanceMode}
          onChange={(checked) => onUpdate({ ...settings, maintenanceMode: checked })}
        />

        <ToggleOption
          title="Cho Phép Đăng Ký"
          description="Cho phép người dùng mới đăng ký tài khoản"
          checked={settings.allowRegistration}
          onChange={(checked) => onUpdate({ ...settings, allowRegistration: checked })}
        />
      </div>
    </div>
  );
};

interface ToggleOptionProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ title, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
};
