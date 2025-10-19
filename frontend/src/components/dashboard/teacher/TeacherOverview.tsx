import React, { useEffect, useState } from "react";
import Card from "../../common/Card";
import { ChartBarIncreasing, Users, Book, TrendingUp, UserCheck, BookOpen } from "lucide-react";
import type { ITeacherStats } from "@services/TeacherService";
import { getTeacherDashboardStats } from "@services/TeacherService";

const Overview = () => {
  const [stats, setStats] = useState<ITeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getTeacherDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                <div className="w-16 h-6 bg-slate-200 rounded"></div>
              </div>
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return <div className="text-center py-8 text-slate-500">Failed to load statistics</div>;

  const averageStudents = stats.totalCourses > 0 ? Math.round(stats.totalStudents / stats.totalCourses) : 0;

  const cardData = [
    {
      title: "Total Courses",
      icon: BookOpen,
      value: stats.totalCourses,
      description: "Courses you're teaching",
      color: "blue",
      trend: null
    },
    {
      title: "Total Students",
      icon: Users,
      value: stats.totalStudents,
      description: "Across all your courses",
      color: "emerald",
      trend: null
    },
    {
      title: "Avg per Course",
      icon: UserCheck,
      value: averageStudents,
      description: "Students per course average",
      color: "purple",
      trend: null
    }
  ];

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
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => {
          const colors = colorClasses[card.color as keyof typeof colorClasses];
          const IconComponent = card.icon;
          
          return (
            <div
              key={index}
              className={`bg-white rounded-xl border ${colors.border} p-6 shadow-sm hover:shadow-md transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors.bg} group-hover:scale-105 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                </div>
                {card.trend && (
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}>
                    {card.trend}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-heading font-bold text-slate-800">{card.value}</h3>
                  {card.trend && (
                    <span className={`text-xs font-medium ${colors.text}`}>↑</span>
                  )}
                </div>
                <h4 className="text-lg font-heading font-semibold text-slate-700">{card.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{card.description}</p>
              </div>

              {/* Progress bar for visual interest */}
              <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${colors.icon} transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${Math.min(100, (card.value / Math.max(...cardData.map(c => c.value))) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Overview;