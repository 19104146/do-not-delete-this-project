
import React from 'react';
import { Users as UsersIcon } from 'lucide-react';

const Users = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <UsersIcon className="h-8 w-8 mr-3 text-primary" />
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-muted-foreground">
          This page will allow you to manage system users and their permissions.
          User management functionality will be implemented in a future update.
        </p>
      </div>
    </div>
  );
};

export default Users;
