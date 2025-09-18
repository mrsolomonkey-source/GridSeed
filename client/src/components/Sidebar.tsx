// Sidebar.tsx
import { useAuth } from '../context/AuthContext'; // 👈 adjust path as needed

const navItems = [
  { label: 'Users', path: '/users', required: 'manage_users' },
  { label: 'Content', path: '/content', required: 'edit_content' },
  { label: 'Reports', path: '/reports', required: 'view_reports' },
];

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <nav style={{ width: '200px', background: '#f4f4f4', padding: '1rem' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {navItems
          .filter((item) => user.capabilities.includes(item.required))
          .map((item) => (
            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
              <a href={item.path}>{item.label}</a>
            </li>
          ))}
      </ul>
    </nav>
  );
};



export default Sidebar;
