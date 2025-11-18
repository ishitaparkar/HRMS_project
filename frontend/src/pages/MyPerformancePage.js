import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

const MyPerformancePage = () => {
  usePageTitle('My Performance');

  return (
    <div className="page-container">
      <h1>My Performance</h1>
      <p>My Performance page - To be implemented</p>
    </div>
  );
};

export default MyPerformancePage;
