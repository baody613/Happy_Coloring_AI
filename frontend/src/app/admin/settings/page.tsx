'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import { useSettings } from './hooks/useSettings';
import { SystemConfigTab, PaymentConfigTab, EmailConfigTab } from './components';
import { SettingsTab } from './types';

export default function AdminSettings() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('config');

  const {
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
  } = useSettings();

  // Auth check
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // Load settings when tab changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      loadSettings(activeTab);
    }
  }, [activeTab, user, loadSettings]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check auth
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">⚙️ Cài Đặt Hệ Thống</h1>
            <p className="text-gray-600 mt-2">Quản lý cấu hình, thanh toán và thông báo</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
          >
            ← Quay lại
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <TabButton
              active={activeTab === 'config'}
              onClick={() => setActiveTab('config')}
              label="🔧 Cấu Hình"
              colorClass="bg-gray-500"
            />
            <TabButton
              active={activeTab === 'payment'}
              onClick={() => setActiveTab('payment')}
              label="💳 Thanh Toán"
              colorClass="bg-violet-500"
            />
            <TabButton
              active={activeTab === 'email'}
              onClick={() => setActiveTab('email')}
              label="📧 Email & Thông Báo"
              colorClass="bg-cyan-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'config' && (
            <SystemConfigTab settings={systemSettings} onUpdate={setSystemSettings} />
          )}
          {activeTab === 'payment' && (
            <PaymentConfigTab settings={paymentSettings} onUpdate={setPaymentSettings} />
          )}
          {activeTab === 'email' && (
            <EmailConfigTab settings={emailSettings} onUpdate={setEmailSettings} />
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={() => loadSettings(activeTab)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              🔄 Tải Lại
            </button>
            <button
              onClick={() => saveSettings(activeTab)}
              disabled={saving}
              className={`px-6 py-3 font-semibold rounded-lg transition ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {saving ? 'Đang lưu...' : '💾 Lưu Cài Đặt'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  colorClass: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label, colorClass }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 px-6 font-semibold transition ${
        active ? `${colorClass} text-white` : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
};
