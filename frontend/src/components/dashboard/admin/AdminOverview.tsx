import React, { useEffect, useState } from "react";
import { Users, BookOpen, GraduationCap, UserCog, BriefcaseBusiness, TrendingUp, Activity } from "lucide-react";
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
          description: "Loading...",
          color: "blue",
          trend: null
        },
        {
          title: "Total Students",
          icon: GraduationCap,
          value: "0",
          description: "Loading...",
          color: "emerald",
          trend: null
        },
        {
          title: "Total Teachers",
          icon: UserCog,
          value: "0",
          description: "Loading...",
          color: "purple",
          trend: null
        },
        {
          title: "Total Courses",
          icon: BookOpen,
          value: "0",
          description: "Loading...",
          color: "amber",
          trend: null
        },
      ];
    }

    return [
      {
        title: "Total Users",
        icon: Users,
        value: dashboardStats.userStats.totalUsers.toString(),
        description: `${dashboardStats.userStats.totalAdmins} admin(s)`,
        color: "blue",
        trend: "+12%"
      },
      {
        title: "Total Students",
        icon: GraduationCap,
        value: dashboardStats.userStats.totalStudents.toString(),
        description: "Enrolled students",
        color: "emerald",
        trend: "+8%"
      },
      {
        title: "Total Teachers",
        icon: UserCog,
        value: dashboardStats.userStats.totalTeachers.toString(),
        description: "Active teachers",
        color: "purple",
        trend: "+5%"
      },
      {
        title: "Total Courses",
        icon: BookOpen,
        value: dashboardStats.totalCourses.toString(),
        description: "Available courses",
        color: "amber",
        trend: "+15%"
      },
    ];
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const [stats, rawData] = await Promise.all([
          fetchStats(),
          getRecentUsers(5)
        ]);
        
        setDashboardStats(stats)

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

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-500",
      text: "text-blue-700",
      border: "border-blue-200"
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "bg-emerald-500",
      text: "text-emerald-700",
      border: "border-emerald-200"
    },
    purple: {
      bg: "bg-purple-50",
      icon: "bg-purple-500",
      text: "text-purple-700",
      border: "border-purple-200"
    },
    amber: {
      bg: "bg-amber-50",
      icon: "bg-amber-500",
      text: "text-amber-700",
      border: "border-amber-200"
    }
  };

  if (loading) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center px-4 py-8 md:px-6 md:py-12">
        <div className="text-center max-w-xs md:max-w-sm mx-auto">
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="relative">
              <Activity className="w-8 h-8 md:w-10 md:h-10 text-blue-600 animate-pulse" />
              <div className="absolute inset-0 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-slate-800 mb-2 md:mb-3">Loading Dashboard</h3>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">Getting everything ready for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8 px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {getStatsData().map((stat, index) => {
          const colors = colorClasses[stat.color as keyof typeof colorClasses];
          const IconComponent = stat.icon;
          
          return (
            <div
              key={index}
              className={`bg-white rounded-xl border ${colors.border} p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-2.5 md:p-3 rounded-xl ${colors.bg} group-hover:scale-105 transition-transform duration-300`}>
                  <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${colors.icon}`} />
                </div>
                {stat.trend && (
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${colors.bg} ${colors.text} flex items-center gap-1`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-slate-800">{stat.value}</h3>
                  {stat.trend && (
                    <span className={`text-xs font-medium ${colors.text}`}>↑</span>
                  )}
                </div>
                <h4 className="text-sm sm:text-base md:text-lg font-heading font-semibold text-slate-700 leading-tight">{stat.title}</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed sm:leading-normal">{stat.description}</p>
              </div>

              {/* Progress bar for visual interest */}
              <div className="mt-3 sm:mt-4 md:mt-5 w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${colors.icon} transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${Math.min(100, (parseInt(stat.value) / Math.max(...getStatsData().map(s => parseInt(s.value)))) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Recent Users */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mx-0 sm:mx-0">
        <div className="p-4 sm:p-5 md:p-6 border-b border-slate-200">
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-lg sm:text-xl md:text-2xl font-heading font-semibold text-slate-800">Recent Users</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Latest user registrations on the platform</p>
          </div>
        </div>
        <div className="p-2 sm:p-3 md:p-4">
          <RecentUsers users={users} />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview; 