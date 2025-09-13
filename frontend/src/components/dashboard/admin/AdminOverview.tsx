import React from "react";
import { Users, BookOpen, LineChart, Server } from "lucide-react";
import Card from "../../common/Card";
import RecentUsers from "./overview/RecentUsers";

const AdminOverview = () => {
  const statsData = [
    {
      title: "Total Users",
      icon: Users,
      percentage: "3",
      description: "1 student, 1 teacher",
    },
    {
      title: "Total Subjects",
      icon: BookOpen,
      percentage: "1",
      description: "Available for assignment",
    },
    {
      title: "Subject Assignments",
      icon: LineChart,
      percentage: "0",
      description: "Teachers assigned to subjects",
    },
    {
      title: "System Status",
      icon: Server,
      percentage: "Active",
      description: "All systems operational",
    },
  ];

  const dummyUsers = [
  { id: "1", name: "James Walker", email: "jwalker@uc.edu.ph", role: "Teacher", createdAt: "2025-09-07" },
  { id: "2", name: "Vince Bryant N. Cabunilas", email: "vincebryantcabunilas@gmail.com", role: "Student", createdAt: "2025-09-07" },
  { id: "3", name: "Sean Joseph C. Arcana", email: "seanjosepharcana@gmail.com", role: "Admin", createdAt: "2025-09-07" },
];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* reports */}
        {statsData.map((stat, index) => (
          <Card
            key={index}
            title={stat.title}
            icon={stat.icon}
            percentage={stat.percentage}
            description={stat.description}
          />
        ))}
        {/* recent users */}
      </div>
      <RecentUsers users={dummyUsers}/>

    </div>
  );
};

export default AdminOverview;
