import React from 'react';
import { Link } from 'react-router-dom';
// Note: We are no longer importing the separate CSS file as it's not needed for this component.

// Import Chart.js components and register them.
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- CHART CONFIGURATIONS ---

const barChartData = {
    labels: ['Arts & Sci', 'Engineering', 'Medicine', 'Business', 'Law', 'Admin'],
    datasets: [{
        label: '# of Employees',
        data: [450, 320, 280, 210, 150, 380],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 6,
    }]
};

const doughnutChartData = {
    labels: ['Faculty', 'Staff', 'Student Workers', 'Adjuncts'],
    datasets: [{
        label: 'Employee Distribution',
        data: [1250, 850, 256, 100],
        backgroundColor: ['rgba(79, 70, 229, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)'],
        borderColor: '#FFFFFF',
        borderWidth: 4,
    }]
};

const chartOptions = {
    bar: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
    },
    doughnut: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        cutout: '70%',
    }
};

// --- MAIN DASHBOARD PAGE COMPONENT ---
const DashboardPage = () => {
    return (
        // The main content container with padding. The redundant header is removed.
        <main className="px-4 md:px-10 py-8 flex-1 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-heading-light dark:text-heading-dark tracking-tight text-3xl font-bold">Welcome Back, Admin</h1>
                    <p className="text-text-light dark:text-text-dark text-sm">Here's a summary of your university's HR status.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
                    <StatCard icon="groups" title="Total Staff & Faculty" value="2,456" change="+1.2%" isPositive={true} />
                    <StatCard icon="work" title="Open Positions" value="78" change="-5%" isPositive={false} />
                    <StatCard icon="hourglass_top" title="Avg. Employee Tenure" value="8.2 years" change="+0.1 yrs" isPositive={true} />
                    <StatCard icon="trending_down" title="Quarterly Turnover" value="3.5%" change="+0.5%" isPositive={true} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
                    <div className="lg:col-span-3 p-6 rounded-xl bg-card-light dark:bg-card-dark shadow-sm">
                        <h3 className="text-lg font-semibold text-heading-light dark:text-heading-dark mb-4">Employees by Department</h3>
                        <div className="h-80"><Bar options={chartOptions.bar} data={barChartData} /></div>
                    </div>
                    <div className="lg:col-span-2 p-6 rounded-xl bg-card-light dark:bg-card-dark shadow-sm">
                        <h3 className="text-lg font-semibold text-heading-light dark:text-heading-dark mb-4">Employee Distribution</h3>
                        <div className="h-80 flex items-center justify-center"><Doughnut options={chartOptions.doughnut} data={doughnutChartData} /></div>
                    </div>
                </div>

                <div className="mt-6 bg-card-light dark:bg-card-dark rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6"><h3 className="text-lg font-semibold text-heading-light dark:text-heading-dark">Open Positions</h3></div>
                    <div className="overflow-x-auto"><OpenPositionsTable /></div>
                </div>
            </div>
        </main>
    );
};


// --- HELPER COMPONENTS ---

const StatCard = ({ icon, title, value, change, isPositive }) => (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm">
        <p className="text-text-light dark:text-text-dark text-sm font-medium">{title}</p>
        <p className="text-heading-light dark:text-heading-dark tracking-tight text-3xl font-bold">{value}</p>
        <p className={`${isPositive ? 'text-green-600' : 'text-red-600'} text-sm font-medium flex items-center gap-1`}>
            <span className="material-symbols-outlined text-base">{isPositive ? 'arrow_upward' : 'arrow_downward'}</span>
            <span>{change}</span>
        </p>
    </div>
);

const OpenPositionsTable = () => {
    const positions = [
        { title: 'Assistant Professor, Computer Science', dept: 'School of Engineering', date: '2025-10-15', status: 'Open' },
        { title: 'Administrative Assistant', dept: 'College of Arts & Sciences', date: '2025-10-12', status: 'Open' },
        { title: 'Research Lab Technician', dept: 'Department of Biology', date: '2025-09-28', status: 'Interviewing' },
        { title: 'Librarian', dept: 'University Library', date: '2025-09-25', status: 'Closed' },
    ];
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Open': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{status}</span>;
            case 'Interviewing': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{status}</span>;
            case 'Closed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{status}</span>;
            default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <table className="w-full text-sm text-left text-text-light dark:text-text-dark">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/60">
                <tr>
                    <th className="px-6 py-3">Job Title</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Date Posted</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody>
                {positions.map(pos => (
                    <tr key={pos.title} className="bg-card-light border-b dark:bg-card-dark dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40">
                        <th scope="row" className="px-6 py-4 font-medium text-heading-light whitespace-nowrap dark:text-heading-dark">{pos.title}</th>
                        <td className="px-6 py-4">{pos.dept}</td>
                        <td className="px-6 py-4">{pos.date}</td>
                        <td className="px-6 py-4">{getStatusBadge(pos.status)}</td>
                        <td className="px-6 py-4 text-right"><Link className="font-medium text-primary hover:underline" to="/recruitment">View</Link></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DashboardPage;