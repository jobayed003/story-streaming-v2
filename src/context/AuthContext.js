import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { createContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fetchData } from '../components/util/youtubeUtils';
import { db } from '../firebase.config';

const AuthProvider = createContext({
  users: [],
  userCredentials: {},
  isAuthenticated: false,
  isDefaultAdmin: false,
});

export const AuthContext = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [isDefaultAdmin, setIsDefaultAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState('login');
  const [userCredentials, setUserCredentials] = useState({
    name: '',
    email: '',
    avatarDetails: {},
    uid: '',
  });

  const updateUserRole = async (id, role) => {
    const userRef = doc(db, 'users', id);

    await updateDoc(userRef, {
      role: role,
    });
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(true);

      const { displayName, email, uid } = user;

      (async () => {
        // Getting Logged in user
        onSnapshot(doc(db, 'users', uid), (doc) => {
          setUserCredentials({
            name: displayName,
            email,
            avatarDetails: doc.data().avatarDetails || {},
            uid,
          });
          if (doc.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        });
      })();

      // Getting all users
      const usersRef = query(collection(db, 'users'), orderBy('timestamp', 'asc'));
      onSnapshot(usersRef, (querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
          users.push({ ...doc.data(), uid: doc.id });
          doc.data().email === 'admin@admin.com' && setIsDefaultAdmin(true);
        });
        setUsers(users);
      });
    });
  }, []);

  const contextValue = {
    isAuthenticated,
    authStep,
    isAdmin,
    users,
    userCredentials,
    isDefaultAdmin,

    setAuthStep,
    setUserCredentials,
    setIsAdmin,
    updateUserRole,
  };

  return <AuthProvider.Provider value={contextValue}>{children}</AuthProvider.Provider>;
};

export default AuthProvider;
