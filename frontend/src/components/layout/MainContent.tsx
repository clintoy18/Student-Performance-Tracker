import Tabs from '../navigation/Tabs';
import type { Role } from '../../utils/roleUtils';
import { getRoleConfig } from '../../utils/roleUtils';
import { useAuth } from '../../context/AuthContext';

const MainContent = () => {
  const { user } = useAuth()

  // const role: Role = getRoleFromUserAuth(user.Role);
  const role: Role = user.Role
  const { tabs, description } = getRoleConfig(role);

  return (
    <main className="w-full px-6 py-4">
      {/* Page Header */}
      <header className="mb-6">
        <h2 className="font-heading text-2xl font-semibold text-gray-800">
          {role} Dashboard
        </h2>
        <p className="font-sans text-sm text-gray-600 mt-1">
          {description}
        </p>
      </header>

      {/* Role-based Tabs */}
      <section>
        <Tabs tabs={tabs} />
      </section>
    </main>
  );
};

export default MainContent;
