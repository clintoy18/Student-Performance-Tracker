import Tabs from '../navigation/Tabs';
import { getRoleConfig } from '../../utils/roleUtils';
import { useAuth } from '../../context/AuthContext';
import type { Role } from '../../utils/roleUtils';
import ExportPDFDropdown from '../common/ExportPDFDropdown';

const MainContent = () => {
  const { user } = useAuth();
  const role: Role = user.Role;
  const studentUserId = user?.UserId;

  const { tabs, description } = getRoleConfig(role, studentUserId);

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

          {role === 'Admin' && (
            <ExportPDFDropdown roles={['Admin', 'Teacher', 'Student', null]} />
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
