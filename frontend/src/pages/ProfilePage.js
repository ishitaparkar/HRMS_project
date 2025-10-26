import React from 'react';

// Mock data for the logged-in administrator's ACCOUNT
const adminAccountData = {
  name: 'Dr. Ananya Sharma',
  email: 'asharma-admin@university.edu',
  role: 'Super Administrator',
  img: 'https://randomuser.me/api/portraits/women/75.jpg',
  loginHistory: [
    { id: 1, ip: '103.48.19.122', location: 'Pune, India', time: 'Today at 10:45 AM', status: 'Success' },
    { id: 2, ip: '103.48.19.122', location: 'Pune, India', time: 'Yesterday at 09:15 PM', status: 'Success' },
    { id: 3, ip: '45.112.88.10', location: 'Mumbai, India', time: '3 days ago at 11:30 AM', status: 'Failed' },
  ]
};

const ProfilePage = () => {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-card-light dark:bg-card-dark p-4 border-b border-border-light dark:border-border-dark flex-shrink-0">
        <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">Admin Account Settings</h1>
      </header>

      <div className="p-8 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md flex items-center space-x-6">
          <img className="w-20 h-20 rounded-full" src={adminAccountData.img} alt={adminAccountData.name} />
          <div>
            <h2 className="text-xl font-bold text-text-light dark:text-text-dark">{adminAccountData.name}</h2>
            <p className="text-subtext-light dark:text-subtext-dark">{adminAccountData.email}</p>
            <p className="text-xs font-semibold uppercase text-primary mt-1">{adminAccountData.role}</p>
          </div>
        </div>

        {/* Security Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Change Password Card */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Change Password</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md shadow-sm" />
              </div>
              <div>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication Card */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Two-Factor Authentication (2FA)</h3>
            <div className="flex items-start space-x-4">
              <span className="material-icons text-green-500 text-3xl">verified_user</span>
              <div>
                <p className="font-semibold text-text-light dark:text-text-dark">2FA is currently enabled.</p>
                <p className="text-sm text-subtext-light dark:text-subtext-dark mt-1">
                  You are using an authenticator app to protect your account.
                </p>
                <button className="text-sm font-medium text-red-500 hover:underline mt-4">
                  Disable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Login History Card */}
        <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Recent Login Activity</h3>
            <ul className="space-y-3">
              {adminAccountData.loginHistory.map(entry => (
                <li key={entry.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div>
                    <p className="text-sm font-medium text-text-light dark:text-text-dark">IP Address: {entry.ip} ({entry.location})</p>
                    <p className="text-xs text-subtext-light">{entry.time}</p>
                  </div>
                  <span className={`text-xs font-bold ${entry.status === 'Success' ? 'text-green-500' : 'text-red-500'}`}>{entry.status}</span>
                </li>
              ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;