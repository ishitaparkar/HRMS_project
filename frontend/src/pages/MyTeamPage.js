import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

const MyTeamPage = () => {
  usePageTitle('My Team');

  return (
    <div className="page-container">
      <h1>My Team</h1>
      <p>My Team page - To be implemented</p>
    </div>
  );
};

export default MyTeamPage;
