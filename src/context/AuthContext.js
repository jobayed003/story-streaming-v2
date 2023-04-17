import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase.config';
import { fetchData } from '../youtubeUtils';

const AuthProvider = createContext({
  users: [],
  userCredentials: {},
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
  const [userCredentials, setUserCredentials] = useState({
    name: '',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        return;
        // navigate('/');
      }

      setIsAuthenticated(true);

      const { displayName, photoUrl, email } = user;

      setUserCredentials({ name: displayName, email, avatar: photoUrl });
      (async () => {
        const userRef = doc(db, 'users', auth.currentUser.uid);
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
      })();
    });
  }, []);

  const contextValue = {
    isAuthenticated,
    authStep,
    setAuthStep,
    isAdmin,
    setIsAdmin,
    users,
    userCredentials,
    setUserCredentials,
    isUpdated,
    setIsUpdated,

    isDefaultAdmin,
  };

  return <AuthProvider.Provider value={contextValue}>{children}</AuthProvider.Provider>;
};

export default AuthProvider;