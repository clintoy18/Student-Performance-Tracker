import React from "react";
import { Users, BookOpen, LineChart, Server } from "lucide-react";
import Card from "../../common/Card";
import RecentUsers from "./overview/RecentUsers";

const AdminOverview = () => {
  const statsData = [
    {
      title: "Total Users",
      icon: Users,
      value: "3",
      description: "1 student, 1 teacher"
    },
    {
      title: "Total Subjects",
      icon: BookOpen,
      value: "1",
      description: "Available for assignment"
    },
    {
      title: "Assignments",
      icon: LineChart,
      value: "0",
      description: "Teacher assignments"
    },
    {
      title: "System Status",
      icon: Server,
      value: "Active",
      description: "All systems operational"
    },
  ];

  const dummyUsers = [
    { id: "1", name: "James Walker", email: "jwalker@uc.edu.ph", role: "Teacher", createdAt: "2025-09-07" },
    { id: "2", name: "Vince Bryant N. Cabunilas", email: "vincebryantcabunilas@gmail.com", role: "Student", createdAt: "2025-09-07" },
    { id: "3", name: "Sean Joseph C. Arcana", email: "seanjosepharcana@gmail.com", role: "Admin", createdAt: "2025-09-07" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            title={stat.title}
            icon={stat.icon}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>

      {/* Recent Users */}
      <RecentUsers users={dummyUsers}/>
    </div>
  );
};

export default AdminOverview;