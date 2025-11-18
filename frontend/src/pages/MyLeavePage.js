import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

const MyLeavePage = () => {
  usePageTitle('My Leave');

  return (
    <div className="page-container">
      <h1>My Leave</h1>
      <p>My Leave page - To be implemented</p>
    </div>
  );
};

export default MyLeavePage;
