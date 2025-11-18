import React, { useState, useEffect } from 'react';
import { usePreferences } from '../../contexts/PreferencesContext';

const NotificationsPreferences = () => {
  const { preferences, updatePreferences, loading: contextLoading } = usePreferences();
  const [localPreferences, setLocalPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    theme: 'system'
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sync local state with context preferences
  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        emailNotifications: preferences.emailNotifications ?? true,
        smsNotifications: preferences.smsNotifications ?? false,
        pushNotifications: preferences.pushNotifications ?? true,
        theme: preferences.theme ?? 'system'
      });
    }
  }, [preferences]);

  // Auto-save functionality with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!contextLoading && JSON.stringify(localPreferences) !== JSON.stringify({
        emailNotifications: preferences.emailNotifications,
        smsNotifications: preferences.smsNotifications,
        pushNotifications: preferences.pushNotifications,
        theme: preferences.theme
      })) {
        handleSave();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localPreferences]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updatePreferences(localPreferences);
    setSaving(false);

    if (result.success) {
      setSuccessMessage('Preferences saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleToggle = (key) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleThemeChange = (theme) => {
    setLocalPreferences(prev => ({
      ...prev,
      theme
    }));
  };

  if (contextLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div 
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 px-4 py-3 rounded-lg flex items-center"
          role="alert"
          aria-live="polite"
        >
          <span className="material-icons text-green-600 dark:text-green-400 mr-2">check_circle</span>
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      {/* Notifications Section */}
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
          <span className="material-icons text-primary mr-2">notifications</span>
          Notification Preferences
        </h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6">
          Choose how you want to receive notifications from the system
        </p>

        <div className="space-y-4">
          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-card-light dark:hover:bg-card-dark transition-colors">
            <div className="flex items-start space-x-3">
              <span className="material-icons text-primary mt-1">email</span>
              <div>
                <label 
                  htmlFor="email-notifications" 
                  className="text-sm font-medium text-text-light dark:text-text-dark cursor-pointer"
                >
                  Email Notifications
                </label>
                <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <button
              id="email-notifications"
              type="button"
              role="switch"
              aria-checked={localPreferences.emailNotifications}
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                localPreferences.emailNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localPreferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* SMS Notifications Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-card-light dark:hover:bg-card-dark transition-colors">
            <div className="flex items-start space-x-3">
              <span className="material-icons text-primary mt-1">sms</span>
              <div>
                <label 
                  htmlFor="sms-notifications" 
                  className="text-sm font-medium text-text-light dark:text-text-dark cursor-pointer"
                >
                  SMS Notifications
                </label>
                <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">
                  Receive notifications via SMS
                </p>
              </div>
            </div>
            <button
              id="sms-notifications"
              type="button"
              role="switch"
              aria-checked={localPreferences.smsNotifications}
              onClick={() => handleToggle('smsNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                localPreferences.smsNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localPreferences.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-card-light dark:hover:bg-card-dark transition-colors">
            <div className="flex items-start space-x-3">
              <span className="material-icons text-primary mt-1">notifications_active</span>
              <div>
                <label 
                  htmlFor="push-notifications" 
                  className="text-sm font-medium text-text-light dark:text-text-dark cursor-pointer"
                >
                  Push Notifications
                </label>
                <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">
                  Receive push notifications in your browser
                </p>
              </div>
            </div>
            <button
              id="push-notifications"
              type="button"
              role="switch"
              aria-checked={localPreferences.pushNotifications}
              onClick={() => handleToggle('pushNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                localPreferences.pushNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localPreferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Theme Preferences Section */}
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
          <span className="material-icons text-primary mr-2">palette</span>
          Theme Preferences
        </h3>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mb-6">
          Choose your preferred theme for the application
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Light Theme */}
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-lg border-2 transition-all ${
              localPreferences.theme === 'light'
                ? 'border-primary bg-primary/5'
                : 'border-border-light dark:border-border-dark hover:border-primary/50'
            }`}
            aria-pressed={localPreferences.theme === 'light'}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="material-icons text-3xl text-yellow-500">light_mode</span>
              <span className="text-sm font-medium text-text-light dark:text-text-dark">Light</span>
              {localPreferences.theme === 'light' && (
                <span className="material-icons text-primary text-sm">check_circle</span>
              )}
            </div>
          </button>

          {/* Dark Theme */}
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-lg border-2 transition-all ${
              localPreferences.theme === 'dark'
                ? 'border-primary bg-primary/5'
                : 'border-border-light dark:border-border-dark hover:border-primary/50'
            }`}
            aria-pressed={localPreferences.theme === 'dark'}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="material-icons text-3xl text-indigo-500">dark_mode</span>
              <span className="text-sm font-medium text-text-light dark:text-text-dark">Dark</span>
              {localPreferences.theme === 'dark' && (
                <span className="material-icons text-primary text-sm">check_circle</span>
              )}
            </div>
          </button>

          {/* System Theme */}
          <button
            onClick={() => handleThemeChange('system')}
            className={`p-4 rounded-lg border-2 transition-all ${
              localPreferences.theme === 'system'
                ? 'border-primary bg-primary/5'
                : 'border-border-light dark:border-border-dark hover:border-primary/50'
            }`}
            aria-pressed={localPreferences.theme === 'system'}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="material-icons text-3xl text-gray-500">settings_suggest</span>
              <span className="text-sm font-medium text-text-light dark:text-text-dark">System</span>
              {localPreferences.theme === 'system' && (
                <span className="material-icons text-primary text-sm">check_circle</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Saving Indicator */}
      {saving && (
        <div className="flex items-center justify-center text-sm text-subtext-light dark:text-subtext-dark">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
          Saving preferences...
        </div>
      )}
    </div>
  );
};

export default NotificationsPreferences;
