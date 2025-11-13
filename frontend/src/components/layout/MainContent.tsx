import Tabs from '../navigation/Tabs';
import type { Role } from '../../utils/roleUtils';
import { getRoleConfig } from '../../utils/roleUtils';
import { useAuth } from '../../context/AuthContext';
import { FileText, Table } from 'lucide-react';

const MainContent = () => {
  const { user } = useAuth();

  const role: Role = user.Role;
  const studentUserId = user?.UserId;

  const { tabs, description } = getRoleConfig(role, studentUserId);

  const handleExportPDF = () => {
    console.log('Exporting PDF for admin...');
    // Implement PDF export logic
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel for admin...');
    // Implement Excel export logic
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
              {/* <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Table className="w-4 h-4" />
                Export Excel
              </button> */}
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
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