import Tabs from '../navigation/Tabs';
import type { Role } from '../../utils/roleUtils';
import { getRoleConfig } from '../../utils/roleUtils';
import { useAuth } from '../../context/AuthContext';
import { FileText } from 'lucide-react';
import { exportDashboardPDF } from '@services'; // <-- import service

const MainContent = () => {
  const { user } = useAuth();
  const role: Role = user.Role;
  const studentUserId = user?.UserId;

  const { tabs, description } = getRoleConfig(role, studentUserId);

  const handleExportPDF = async (exportRole: string) => {
    try {
      const blob = await exportDashboardPDF(exportRole); // role as query param

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exportRole}-dashboard-summary.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error(`Error exporting ${exportRole} PDF:`, error);
    }
  };


  return (
    <main className="w-full px-6 py-4">
      <header className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-gray-800">
              {role} Dashboard
            </h2>
            <p className="font-sans text-sm text-gray-600 mt-1">
              {description}
            </p>
          </div>

          {/* Export Buttons for Admin only */}
         {role === 'Admin' && (
          <div className="flex items-center gap-2">
            {['Admin', 'Teacher', 'Student'].map((exportRole) => (
              <button
                key={exportRole}
                onClick={() => handleExportPDF(exportRole)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium
                  ${
                    exportRole === 'Admin'
                      ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100'
                      : exportRole === 'Teacher'
                      ? 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100'
                      : 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100'
                  } border rounded-lg transition-colors`}
              >
                <FileText className="w-4 h-4" />
                Export {exportRole} PDF
              </button>
            ))}
          </div>
        )}

        </div>
      </header>

      <section>
        <Tabs tabs={tabs} />
      </section>
    </main>
  );
};

export default MainContent;
