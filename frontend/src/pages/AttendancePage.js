import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AttendancePage.css'; // We will use this for custom calendar styles
import moment from 'moment';

// --- MAIN PAGE COMPONENT ---
const AttendancePage = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/employees/');
        const employeesData = response.data.results || response.data || [];
        setAllEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const todaysAttendance = allEmployees.map((employee, index) => ({
    ...employee,
    status: ['Present', 'Absent', 'On Leave'][index % 3],
  }));

  const filteredAttendance = todaysAttendance.filter(staff => {
    if (activeFilter === 'All') return true;
    return staff.status === activeFilter;
  });

  const handleViewAttendance = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const getStatusBadgeClass = (status) => { /* ... (same as before) ... */ };
  const getFilterButtonClass = (filter) => { /* ... (same as before) ... */ };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Today's Attendance</h1>
        <p className="text-sm text-subtext-light">Summary of staff attendance for today.</p>
      </div>

      <div className="mb-6 flex space-x-2">
        {/* ... (Filter buttons) ... */}
      </div>

      <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-sm">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-background-light">
              <tr>
                <th className="px-6 py-3">Staff Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Today's Status</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((staff) => (
                <tr key={staff.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{staff.firstName} {staff.lastName}</td>
                  <td className="px-6 py-4">{staff.department}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(staff.status)}`}>{staff.status}</span></td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleViewAttendance(staff)} className="text-primary hover:underline text-xs font-medium">View Attendance</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <CalendarModal 
          employee={selectedEmployee} 
          closeModal={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

// --- HELPER COMPONENT FOR THE ADVANCED CALENDAR MODAL ---
const CalendarModal = ({ employee, closeModal }) => {
  const [timeFilter, setTimeFilter] = useState('Month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState(0);

  const [date, setDate] = useState(new Date());

  // Simulate fetching records based on filters
  const attendanceRecords = generateMonthlyAttendance(selectedYear, selectedMonth);

  const getWeeksInMonth = (year, month) => {
    const firstDay = moment({ year, month }).startOf('month');
    const lastDay = moment({ year, month }).endOf('month');
    const weeks = [];
    let currentWeek = [];
    let currentDate = firstDay.clone();

    while (currentDate.isSameOrBefore(lastDay)) {
      currentWeek.push(currentDate.clone());
      if (currentDate.day() === 6 || currentDate.isSame(lastDay, 'day')) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.add(1, 'day');
    }
    return weeks.map((week, index) => ({
        index,
        label: `Week ${index + 1}: ${moment(week[0]).format('MMM D')} - ${moment(week[week.length-1]).format('MMM D')}`
    }));
  };

  const weeks = getWeeksInMonth(selectedYear, selectedMonth);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-xl relative">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Attendance: {employee?.firstName} {employee?.lastName}
        </h2>
        <p className="text-sm text-subtext-light mb-4">View attendance records by different time ranges.</p>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="text-sm">
            <option>Year</option><option>Month</option><option>Week</option><option>Day</option>
          </select>
          {timeFilter === 'Year' && (
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-sm">
              <option>2025</option><option>2024</option><option>2023</option>
            </select>
          )}
          {(timeFilter === 'Month' || timeFilter === 'Week') && (
            <>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-sm">
                <option>2025</option><option>2024</option><option>2023</option>
              </select>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-sm">
                {moment.months().map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </>
          )}
          {timeFilter === 'Week' && (
            <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)} className="text-sm">
                {weeks.map(w => <option key={w.index} value={w.index}>{w.label}</option>)}
            </select>
          )}
        </div>

        <Calendar
          className="border-none"
          value={date}
          onChange={setDate}
          activeStartDate={new Date(selectedYear, selectedMonth)}
          tileContent={({ date }) => {
            const status = attendanceRecords[date.toDateString()];
            if (status === 'Present') return <div className="calendar-dot bg-green-500"></div>;
            if (status === 'Absent') return <div className="calendar-dot bg-red-500"></div>;
            if (status === 'Half Day') return <div className="calendar-dot bg-yellow-500"></div>;
            return null;
          }}
        />

        <div className="flex justify-start space-x-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center"><span className="legend-dot bg-green-500"></span>Present</div>
          <div className="flex items-center"><span className="legend-dot bg-red-500"></span>Absent</div>
          <div className="flex items-center"><span className="legend-dot bg-yellow-500"></span>Half Day</div>
        </div>

        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
      </div>
    </div>
  );
};

// Helper function to simulate monthly data
const generateMonthlyAttendance = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const records = {};
    const statuses = ['Present', 'Present', 'Absent', 'Half Day'];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        records[date.toDateString()] = statuses[Math.floor(Math.random() * statuses.length)];
      }
    }
    return records;
};

// ... (Other helper functions like getStatusBadgeClass can be copied from the previous version)

export default AttendancePage;
