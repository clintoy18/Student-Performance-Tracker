import React, { useEffect, useState } from "react";
import { Users, BookOpen, LineChart, Server } from "lucide-react";
import Card from "../../common/Card";
import RecentUsers from "./overview/RecentUsers";
import { getRecentUsers } from "@services";
import type { IUser } from "@interfaces";
import FullPageSpinner from "../../common/LoadingSpinnerPage";
import { parseNumericRole } from "../../../utils/roleUtils";

const AdminOverview = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    const fetchRecentUsers = async (count: number) => {
      setLoading(true)
      try {
        const rawData = await getRecentUsers(count)
        const parsedUsers: IUser[] = rawData
          .map((user) => {
            const role = parseNumericRole(user.role)
            if (role === null) {
              console.warn("Unknown role value:", user.Role, "for user", user.UserId);
              return null; // or fallback to "Student"
            }

            return {
              FirstName: user.firstName,
              LastName: user.lastName,
              MiddleName: user.middleName,
              Program: user.program,
              UserId: user.userId,
              CreatedTime: user.createdTime,
              Role: role
            }
          })
          .filter((user): user is IUser => user !== null)
        setUsers(parsedUsers)
      } catch (error) {
        console.error('Error fetching recent users: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentUsers(5)
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {loading ? (
        <FullPageSpinner />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {statsData.map((stat, index) => (
              <Card
                key={index}
                title={stat.title}
                icon={stat.icon}
                percentage={stat.value}
                description={stat.description}
              />
            ))}
          </div>

          {/* Recent Users */}
          <RecentUsers users={users} />
        </>
      )
      }
    </div >
  );
};

export default AdminOverview;