import React, { useState, useEffect } from 'react';
import { usePermission } from '../contexts/PermissionContext';
import usePageTitle from '../hooks/usePageTitle';
import DocumentsSection from '../components/profile/DocumentsSection';
import NotificationsPreferences from '../components/profile/NotificationsPreferences';

const ProfilePage = () => {
  const { roles, user } = usePermission();
  const [activeTab, setActiveTab] = useState('employee'); // Changed default to employee
  const [profileData, setProfileData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Set page title for accessibility
  usePageTitle('My Profile');

  // Handle keyboard navigation for tabs
  const handleTabKeyDown = (e, tabName) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tabName);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const tabs = ['employee', 'account'];
      const currentIndex = tabs.indexOf(activeTab);
      let newIndex;
      
      if (e.key === 'ArrowLeft') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      } else {
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      }
      
      setActiveTab(tabs[newIndex]);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user profile
        const profileResponse = await fetch('http://localhost:8000/api/auth/profile/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          setProfileData(data);
          
          // If user has an employee record, fetch it
          if (data.employee_id) {
            const employeeResponse = await fetch(`http://localhost:8000/api/employees/${data.employee_id}/`, {
              headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            if (employeeResponse.ok) {
              const empData = await employeeResponse.json();
              setEmployeeData(empData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);
  
  // Helper function to get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700';
      case 'HR Manager':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700';
      case 'Department Head':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700';
      case 'Employee':
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Super Admin':
        return 'admin_panel_settings';
      case 'HR Manager':
        return 'manage_accounts';
      case 'Department Head':
        return 'supervisor_account';
      case 'Employee':
        return 'person';
      default:
        return 'person';
    }
  };

  // Get display name from employee data or user data
  const displayName = employeeData 
    ? `${employeeData.firstName} ${employeeData.lastName}`
    : profileData?.username || user?.username || 'User';
  
  const displayEmail = user?.email || profileData?.email || '';
  const displayImage = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=3b82f6&color=fff&size=128';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-subtext-light dark:text-subtext-dark">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-card-light dark:bg-card-dark p-6 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <h1 className="text-3xl font-bold text-heading-light dark:text-heading-dark">My Profile</h1>
        <p className="text-sm text-subtext-light dark:text-subtext-dark mt-1">
          Manage your account settings and view your employee information
        </p>
      </header>

      <div className="p-4 md:p-8 space-y-6">
        {/* Profile Header Card */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img 
            className="w-24 h-24 rounded-full ring-4 ring-primary/20" 
            src={displayImage} 
            alt={displayName} 
          />
          <div className="flex-grow text-center md:text-left">
            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">{displayName}</h2>
            <p className="text-subtext-light dark:text-subtext-dark">{displayEmail}</p>
            
            {/* Role Badges */}
            {roles && roles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                {roles.map((role, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(role)}`}
                  >
                    <span className="material-icons text-xs mr-1" style={{ fontSize: '12px', verticalAlign: 'middle' }}>
                      {getRoleIcon(role)}
                    </span>
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabbed Interface */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-border-light dark:border-border-dark" role="tablist">
            <button
              onClick={() => setActiveTab('employee')}
              onKeyDown={(e) => handleTabKeyDown(e, 'employee')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'employee'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              aria-selected={activeTab === 'employee'}
              role="tab"
              aria-controls="employee-tab-panel"
              id="employee-tab"
              tabIndex={activeTab === 'employee' ? 0 : -1}
            >
              <span className="material-icons text-sm mr-2" style={{ fontSize: '16px', verticalAlign: 'middle' }}>
                badge
              </span>
              Employee Profile
            </button>
            <button
              onClick={() => setActiveTab('account')}
              onKeyDown={(e) => handleTabKeyDown(e, 'account')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'account'
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-subtext-light dark:text-subtext-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
              aria-selected={activeTab === 'account'}
              role="tab"
              aria-controls="account-tab-panel"
              id="account-tab"
              tabIndex={activeTab === 'account' ? 0 : -1}
            >
              <span className="material-icons text-sm mr-2" style={{ fontSize: '16px', verticalAlign: 'middle' }}>
                security
              </span>
              Account Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <div
              role="tabpanel"
              id="employee-tab-panel"
              aria-labelledby="employee-tab"
              hidden={activeTab !== 'employee'}
            >
              {activeTab === 'employee' && <EmployeeProfileTab employeeData={employeeData} />}
            </div>
            <div
              role="tabpanel"
              id="account-tab-panel"
              aria-labelledby="account-tab"
              hidden={activeTab !== 'account'}
            >
              {activeTab === 'account' && <AccountSettingsTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Account Settings Tab Component
const AccountSettingsTab = () => {
  // Mock login history for now - can be fetched from backend later
  const loginHistory = [
    { id: 1, ip: '103.48.19.122', location: 'Local', time: 'Today', status: 'Success' },
  ];

  return (
    <div className="space-y-6">
      {/* Security Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password Card */}
        <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
            <span className="material-icons text-primary mr-2">lock</span>
            Change Password
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1">
                Current Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-3 py-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-md shadow-sm text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1">
                New Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-3 py-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-md shadow-sm text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1">
                Confirm New Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-3 py-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-md shadow-sm text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary focus:border-transparent" 
              />
            </div>
            <div>
              <button 
                type="submit" 
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
            <span className="material-icons text-primary mr-2">verified_user</span>
            Two-Factor Authentication
          </h3>
          <div className="flex items-start space-x-4">
            <span className="material-icons text-green-500 text-3xl">check_circle</span>
            <div>
              <p className="font-semibold text-text-light dark:text-text-dark">2FA is currently enabled</p>
              <p className="text-sm text-subtext-light dark:text-subtext-dark mt-1">
                You are using an authenticator app to protect your account.
              </p>
              <button className="text-sm font-medium text-red-500 hover:text-red-600 hover:underline mt-4 transition-colors">
                Disable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications & Preferences Section */}
      <NotificationsPreferences />

      {/* Login History Card */}
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 flex items-center">
          <span className="material-icons text-primary mr-2">history</span>
          Recent Login Activity
        </h3>
        <ul className="space-y-2">
          {loginHistory.map(entry => (
            <li 
              key={entry.id} 
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg hover:bg-card-light dark:hover:bg-card-dark transition-colors border border-transparent hover:border-border-light dark:hover:border-border-dark"
            >
              <div>
                <p className="text-sm font-medium text-text-light dark:text-text-dark">
                  <span className="material-icons text-xs mr-1" style={{ fontSize: '14px', verticalAlign: 'middle' }}>
                    computer
                  </span>
                  IP Address: {entry.ip} ({entry.location})
                </p>
                <p className="text-xs text-subtext-light dark:text-subtext-dark mt-1">{entry.time}</p>
              </div>
              <span 
                className={`text-xs font-bold px-2 py-1 rounded-full mt-2 md:mt-0 ${
                  entry.status === 'Success' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}
              >
                {entry.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Employee Profile Tab Component
const EmployeeProfileTab = ({ employeeData }) => {
  if (!employeeData) {
    return (
      <div className="text-center py-12">
        <span className="material-icons text-6xl text-subtext-light dark:text-subtext-dark mb-4">person_off</span>
        <p className="text-subtext-light dark:text-subtext-dark">No employee record found for this account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <InfoCard title="Contact Information" icon="contact_mail">
            <InfoRow icon="email" label="Personal Email" value={employeeData.personalEmail || 'N/A'} />
            <InfoRow icon="phone" label="Phone" value={employeeData.mobileNumber || 'N/A'} />
          </InfoCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Job Information" icon="work">
            <InfoRow icon="badge" label="Employee ID" value={employeeData.employeeId || 'N/A'} />
            <InfoRow icon="person" label="Name" value={`${employeeData.firstName} ${employeeData.lastName}`} />
            <InfoRow icon="school" label="Department" value={employeeData.department || 'N/A'} />
            <InfoRow icon="work_outline" label="Designation" value={employeeData.designation || 'N/A'} />
            <InfoRow icon="calendar_today" label="Date of Joining" value={employeeData.joiningDate || 'N/A'} />
          </InfoCard>
        </div>
      </div>

      {/* Documents Section */}
      <DocumentsSection employeeId={employeeData.id} />
    </div>
  );
};

// Helper components
const InfoCard = ({ title, icon, children }) => (
  <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark flex items-center">
      {icon && <span className="material-icons text-primary mr-2">{icon}</span>}
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start">
    <span className="material-icons text-primary text-lg mr-3 mt-1">{icon}</span>
    <div className="flex-1">
      <p className="text-sm text-subtext-light dark:text-subtext-dark">{label}</p>
      <p className="font-medium text-text-light dark:text-text-dark mt-1">{value}</p>
    </div>
  </div>
);

export default ProfilePage;