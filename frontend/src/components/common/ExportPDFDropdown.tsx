import { useState } from 'react';
import { FileText, ChevronDown } from 'lucide-react';
import { exportDashboardPDF } from '@services';

interface ExportPDFDropdownProps {
  roles: (string | null)[];
}

const ExportPDFDropdown: React.FC<ExportPDFDropdownProps> = ({ roles }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(roles[0] || null);
  const [isOpen, setIsOpen] = useState(false);

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'Admin':
        return 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100';
      case 'Teacher':
        return 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'Student':
        return 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-300 hover:bg-gray-100';
    }
  };

  const handleExportPDF = async (role: string | null) => {
    try {
      const exportParam = role ?? 'All';
      const blob = await exportDashboardPDF(role); // backend handles null as all

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${exportParam}-dashboard-summary.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error(`Error exporting ${selectedRole ?? 'All'} PDF:`, error);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${getRoleColor(selectedRole)}`}
      >
        <FileText className="w-4 h-4" />
        Export: {selectedRole ?? 'All'}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {roles.map((role) => (
            <li
              key={role ?? 'All'}
              onClick={() => {
                setSelectedRole(role);
                setIsOpen(false);
                handleExportPDF(role);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${getRoleColor(role)}`}
            >
              {role ?? 'All'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExportPDFDropdown;
