import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { widgetConfig } from '../dashboard/widgets';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  capabilities: string[];
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Unauthorized or failed to fetch user');
        }

        const data = await res.json();
        setUser(data.data);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  if (loading) return <h1>Loading Dashboard...</h1>;
  if (error) return <h1>{error}</h1>;
  if (!user) return <h1>No user data available</h1>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Main content */}
      <main style={{ flex: 1, padding: '1rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Welcome, {user.name}</h1>
          <button onClick={handleLogout}>Logout</button>
        </header>

        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>

        <h3>Capabilities:</h3>
        <ul>
          {user.capabilities.map((cap) => (
            <li key={cap}>{cap}</li>
          ))}
        </ul>

        {/* Capability-driven widgets */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          {widgetConfig
            .filter((w) => user.capabilities.includes(w.capability))
            .map((w, idx) => {
              const Widget = w.component;
              return <Widget key={idx} />;
            })}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
