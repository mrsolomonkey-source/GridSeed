## Connecting React Frontend

- Set `REACT_APP_API_URL` in your frontend `.env` to your backend URL (e.g., `http://localhost:5000/api`).
- Example login with axios:

```js
import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}


---

**You now have a modular, production-ready TypeScript backend with MongoDB, JWT auth, RBAC, and a clean structure for future expansion.**  
Add more models/controllers/routes

The connection string must start 
with mongodb:
// (for local) or 
// mongodb+srv:// (for Atlas/cloud).