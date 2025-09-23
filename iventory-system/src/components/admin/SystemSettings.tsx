import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import './css/dashboard.css';

interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  description: string;
  data_type: string;
  is_editable: boolean;
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || []);
      } else {
        throw new Error('Failed to load settings');
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      // Mock data for now
      setSettings([
        {
          id: 1,
          setting_key: 'tax_rate',
          setting_value: '10.0',
          description: 'Default tax rate percentage',
          data_type: 'number',
          is_editable: true
        },
        {
          id: 2,
          setting_key: 'currency',
          setting_value: 'USD',
          description: 'System currency',
          data_type: 'string',
          is_editable: true
        },
        {
          id: 3,
          setting_key: 'low_stock_alert',
          setting_value: 'true',
          description: 'Enable low stock alerts',
          data_type: 'boolean',
          is_editable: true
        },
        {
          id: 4,
          setting_key: 'company_name',
          setting_value: 'Inventory Management System',
          description: 'Company name for reports',
          data_type: 'string',
          is_editable: true
        },
        {
          id: 5,
          setting_key: 'company_address',
          setting_value: '123 Business Street, City, State 12345',
          description: 'Company address',
          data_type: 'string',
          is_editable: true
        },
        {
          id: 6,
          setting_key: 'backup_frequency',
          setting_value: '24',
          description: 'Backup frequency in hours',
          data_type: 'number',
          is_editable: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (id: number, value: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, setting_value: value } : setting
    ));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (err) {
      setMessage('Error saving settings');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    if (!setting.is_editable) {
      return (
        <span style={{ color: '#666666', fontStyle: 'italic' }}>
          {setting.setting_value}
        </span>
      );
    }

    switch (setting.data_type) {
      case 'boolean':
        return (
          <select
            value={setting.setting_value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="form-select"
            style={{ margin: 0, width: '120px' }}
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={setting.setting_value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="form-input"
            style={{ margin: 0, width: '120px' }}
          />
        );
      default:
        return (
          <input
            type="text"
            value={setting.setting_value}
            onChange={(e) => updateSetting(setting.id, e.target.value)}
            className="form-input"
            style={{ margin: 0, minWidth: '200px' }}
          />
        );
    }
  };

  return (
    <MainLayout title="⚙️ System Settings">
      <div className="admin-dashboard">
        <div className="content-header">
          <h1 className="content-title">System Settings</h1>
          <p className="content-subtitle">Configure system-wide settings and preferences</p>
        </div>

        <div className="quick-actions">
          <button 
            className="quick-action-btn"
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? '💾 Saving...' : '💾 Save Settings'}
          </button>
          <button 
            className="quick-action-btn"
            onClick={loadSettings}
          >
            🔄 Reset Changes
          </button>
          <button className="quick-action-btn">
            📋 Export Config
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'error' : 'success'}`}>
            <span>{message.includes('Error') ? '⚠️' : '✅'}</span>
            {message}
          </div>
        )}

        <div className="dashboard-grid">
          {/* General Settings */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon">🏢</span>
                Company Information
              </h3>
            </div>
            <div className="card-content">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {settings
                    .filter(s => ['company_name', 'company_address', 'currency'].includes(s.setting_key))
                    .map(setting => (
                      <div key={setting.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '500', fontSize: '14px' }}>
                          {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <p style={{ fontSize: '12px', color: '#666666', margin: '0 0 5px 0' }}>
                          {setting.description}
                        </p>
                        {renderSettingInput(setting)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Financial Settings */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon">💰</span>
                Financial Settings
              </h3>
            </div>
            <div className="card-content">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {settings
                    .filter(s => ['tax_rate'].includes(s.setting_key))
                    .map(setting => (
                      <div key={setting.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '500', fontSize: '14px' }}>
                          {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <p style={{ fontSize: '12px', color: '#666666', margin: '0 0 5px 0' }}>
                          {setting.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {renderSettingInput(setting)}
                          <span style={{ fontSize: '14px', color: '#666666' }}>%</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* System Preferences */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon">🔧</span>
                System Preferences
              </h3>
            </div>
            <div className="card-content">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {settings
                    .filter(s => ['low_stock_alert', 'backup_frequency'].includes(s.setting_key))
                    .map(setting => (
                      <div key={setting.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: '500', fontSize: '14px' }}>
                          {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <p style={{ fontSize: '12px', color: '#666666', margin: '0 0 5px 0' }}>
                          {setting.description}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {renderSettingInput(setting)}
                          {setting.setting_key === 'backup_frequency' && (
                            <span style={{ fontSize: '14px', color: '#666666' }}>hours</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* System Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-icon">🛠️</span>
                System Maintenance
              </h3>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Database Backup</h4>
                  <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 10px 0' }}>
                    Create a backup of the entire database
                  </p>
                  <button className="action-btn secondary">
                    💾 Create Backup
                  </button>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>System Logs</h4>
                  <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 10px 0' }}>
                    View and download system logs
                  </p>
                  <button className="action-btn secondary">
                    📋 View Logs
                  </button>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Cache Management</h4>
                  <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 10px 0' }}>
                    Clear system cache to improve performance
                  </p>
                  <button className="action-btn secondary">
                    🗑️ Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SystemSettings;
