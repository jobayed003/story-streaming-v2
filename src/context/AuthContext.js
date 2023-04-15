import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.config';
import { fetchData } from '../youtubeUtils';

const AuthProvider = createContext({
  users: [],
  isAuthenticated: false,
  authenticateUser: () => {},
});

export const AuthContext = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isDefaultAdmin, setIsDefaultAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState('login');

  const authenticateUser = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // navigate('/');
      } else {
        setIsAuthenticated(true);
      }

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.data().role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      let users = [];

      const data = await fetchData('users');

      data.forEach((el) => {
        users.push({ name: el.name, email: el.email, role: el.role, id: el.id });
        el.email === 'admin@admin.com' && setIsDefaultAdmin(true);
      });
      setUsers(users);
    });
  });

  const contextValue = {
    isAuthenticated,
    authenticateUser,
    authStep,
    setAuthStep,
    isAdmin,
    setIsAdmin,
    users,
    isUpdated,
    setIsUpdated,
    isDefaultAdmin,
  };

  return <AuthProvider.Provider value={contextValue}>{children}</AuthProvider.Provider>;
};

export default AuthProvider;
