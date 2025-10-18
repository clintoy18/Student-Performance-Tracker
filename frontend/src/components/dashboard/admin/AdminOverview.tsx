import React, { useEffect, useState } from "react";
import { Users, BookOpen, GraduationCap, UserCog, BriefcaseBusiness } from "lucide-react";
import Card from "../../common/Card";
import RecentUsers from "./overview/RecentUsers";
import { getRecentUsers, fetchStats } from "@services";
import type { IUser, IDashboardStats } from "@interfaces";
import FullPageSpinner, { InlineSpinner } from "../../common/LoadingSpinnerPage";
import { parseNumericRole } from "../../../utils/roleUtils";

const AdminOverview = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const [dashboardStats, setDashboardStats] = useState<IDashboardStats | null>(null)
  const [loading, setLoading] = useState(false)

  const getStatsData = () => {
    if (!dashboardStats) {
      return [
        {
          title: "Total Users",
          icon: Users,
          value: "0",
          description: "Loading..."
        },
        {
          title: "Total Students",
          icon: GraduationCap,
          value: "0",
          description: "Loading..."
        },
        {
          title: "Total Teachers",
          icon: BriefcaseBusiness,
          value: "0",
          description: "Loading..."
        },
        {
          title: "Total Courses",
          icon: BookOpen,
          value: "0",
          description: "Loading..."
        },
      ];
    }

    return [
      {
        title: "Total Users",
        icon: Users,
        value: dashboardStats.userStats.totalUsers.toString(),
        description: `${dashboardStats.userStats.totalAdmins} admin(s)`
      },
      {
        title: "Total Students",
        icon: GraduationCap,
        value: dashboardStats.userStats.totalStudents.toString(),
        description: "Enrolled students"
      },
      {
        title: "Total Teachers",
        icon: BriefcaseBusiness,
        value: dashboardStats.userStats.totalTeachers.toString(),
        description: "Active teachers"
      },
      {
        title: "Total Courses",
        icon: BookOpen,
        value: dashboardStats.totalCourses.toString(),
        description: "Available courses"
      },
    ];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch dashboard stats
        const stats = await fetchStats()
        setDashboardStats(stats)

        // Fetch recent users
        const rawData = await getRecentUsers(5)
        const parsedUsers: IUser[] = rawData
          .map((user) => {
            const role = parseNumericRole(user.role)
            if (role === null) {
              console.warn("Unknown role value:", user.Role, "for user", user.UserId);
              return null;
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
        console.error('Error fetching dashboard data: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {loading ? (
        <div className="flex flex-col py-32 items-center">
          <InlineSpinner />
          <span className="text-sm py-4 text-gray-800">Loading awesome dashboard stats!</span>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {getStatsData().map((stat, index) => (
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