import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for candidates in the pipeline
const candidates = [
  { id: 1, name: 'Aarav Sharma', position: 'Asst. Professor, CS', status: 'Applied', appliedDate: '2025-10-20' },
  { id: 2, name: 'Sanya Verma', position: 'Lab Technician, Physics', status: 'Screening', appliedDate: '2025-10-18' },
  { id: 3, name: 'Rohan Mehta', position: 'Asst. Professor, CS', status: 'Interview', appliedDate: '2025-10-15' },
  { id: 4, name: 'Priya Singh', position: 'Junior Librarian', status: 'Offer Made', appliedDate: '2025-10-12' },
  { id: 5, name: 'Karan Malhotra', position: 'Asst. Professor, CS', status: 'Hired', appliedDate: '2025-10-10' },
  { id: 6, name: 'Isha Gupta', position: 'Admissions Counselor', status: 'Rejected', appliedDate: '2025-10-08' },
];

const RecruitmentPage = () => {
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Applied</span>;
      case 'Screening': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Screening</span>;
      case 'Interview': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Interview</span>;
      case 'Offer Made': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Offer Made</span>;
      case 'Hired': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Hired</span>;
      case 'Rejected': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
          <div>
              <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Recruitment Overview</h1>
              <p className="text-sm text-subtext-light">Manage all active candidate pipelines.</p>
          </div>
          <Link 
            to="/post-vacancy"
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600"
          >
              <span className="material-icons mr-2 text-base">post_add</span> Post New Vacancy
          </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="folder_open" title="Total Active Candidates" value="34" />
        <StatCard icon="event" title="Interviews This Week" value="5" />
        <StatCard icon="pending" title="New Applicants" value="12" />
        <StatCard icon="person_add" title="Hired This Month" value="2" />
      </div>
      
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">All Candidates</h3>
          <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-subtext-light">search</span>
              <input type="text" placeholder="Search by name..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-background-light dark:bg-gray-800 border border-border-light dark:border-border-dark" />
          </div>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-subtext-light dark:text-subtext-dark uppercase bg-background-light dark:bg-background-dark">
            <tr>
              <th className="px-6 py-3">Candidate Name</th>
              <th className="px-6 py-3">Applied For</th>
              <th className="px-6 py-3">Application Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-text-light dark:text-white">{candidate.name}</td>
                <td className="px-6 py-4">{candidate.position}</td>
                <td className="px-6 py-4">{candidate.appliedDate}</td>
                <td className="px-6 py-4">{getStatusBadge(candidate.status)}</td>
                <td className="px-6 py-4 text-center">
                  <button className="text-primary hover:underline text-xs font-medium">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="bg-card-light dark:bg-card-dark p-5 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-primary/10 p-3 rounded-full">
      <span className="material-icons text-primary text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-sm font-medium text-subtext-light dark:text-subtext-dark">{title}</p>
      <p className="text-2xl font-bold text-text-light dark:text-text-dark">{value}</p>
    </div>
  </div>
);

export default RecruitmentPage;