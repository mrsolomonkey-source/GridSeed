import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 if you're using react-router

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  capabilities: string[];
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // assuming you store JWT here
        if (!token) {
          navigate('/login'); // 👈 redirect if no token
          return;
        }

        const res = await fetch('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch user');
          localStorage.removeItem('token'); // clear invalid token
          navigate('/login');
          return;
        }

        const data = await res.json();
        setUser(data.data); // backend wraps response in { success, data }
      } catch (err) {
        console.error('Error fetching user:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    // Clear token and user state
    localStorage.removeItem('token');
    setUser(null);

    // Redirect to login
    navigate('/login');
  };

  if (!user) {
    return <h1>Loading Dashboard...</h1>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <h2>Hello, {user.name}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <h3>Capabilities:</h3>
      <ul>
        {user.capabilities.map((cap) => (
          <li key={cap}>{cap}</li>
        ))}
      </ul>

      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
