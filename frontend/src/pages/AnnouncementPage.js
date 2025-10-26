import React, { useState } from 'react';
// 1. Import the reusable component we just created
import AnnouncementCard from '../components/AnnouncementCard';

// Mock data for announcements
const initialAnnouncements = [
  { 
    id: 1, 
    title: 'Diwali Celebration & Holidays', 
    date: '2025-10-20',
    author: 'Administration Office',
    content: 'The university will be closed from October 29th to November 2nd for Diwali celebrations. We wish everyone a happy and prosperous festival of lights.' 
  },
  { 
    id: 2, 
    title: 'Library Hours Extended for Exams', 
    date: '2025-10-18',
    author: 'Library Services',
    content: 'To support students during the upcoming mid-term examinations, the central library will be open 24/7 from October 25th until November 15th.' 
  },
  { 
    id: 3, 
    title: 'Annual Sports Fest "Spardha 2025"', 
    date: '2025-10-15',
    author: 'Student Council',
    content: 'Get ready for the annual sports festival, Spardha! Registrations for all events are now open at the Student Council office. The event will kick off on November 20th.' 
  },
];

const AnnouncementPage = () => {
  // 2. Use state to hold the list of announcements
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  return (
    <>
      <header className="bg-card-light dark:bg-card-dark p-4 flex justify-between items-center border-b border-border-light dark:border-border-dark sticky top-0">
        <h1 className="text-2xl font-semibold text-text-light dark:text-text-dark">University Announcements</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-blue-600">
          <span className="material-icons mr-2 text-base">add</span> Create New
        </button>
      </header>

      <div className="p-8">
        {/* 3. A container for our list of cards */}
        <div className="space-y-6">
          {/* 4. Map over the announcements data and render an AnnouncementCard for each one */}
          {announcements.map(announcement => (
            <AnnouncementCard
              key={announcement.id}
              title={announcement.title}
              date={announcement.date}
              author={announcement.author}
              content={announcement.content}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AnnouncementPage;