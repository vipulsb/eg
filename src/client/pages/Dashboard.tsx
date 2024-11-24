import React from "react";
import { useAuthStore } from "../store/authStore";

const Dashboard: React.FC = () => {
  const { logout, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome {user.name || user.email}!
      </h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
