import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { createContext, useEffect, useState } from 'react';

import { getAllAvatar } from '../components/util/firebaseUtil';
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
  const [avatarUrls, setAvatarUrls] = useState([]);

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
      setAvatarUrls(await getAllAvatar());
      setIsAuthenticated(true);

      const { displayName, email, uid } = user;

      (async () => {
        // Getting Logged in user details
        onSnapshot(doc(db, 'users', uid), (doc) => {
          setUserCredentials({
            name: displayName,
            email,
            //  for existing users
            avatarDetails: doc.data().avatarDetails || {
              id: 1,
              avatar:
                'https://firebasestorage.googleapis.com/v0/b/story-streaming-84a2e.appspot.com/o/avatar%2Favatar_1.png?alt=media&token=bc42b4b5-3712-4d97-a41a-fb7c53340a32',
            },
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
    avatarUrls,

    setAuthStep,
    setUserCredentials,
    setIsAdmin,
    updateUserRole,
  };

  return <AuthProvider.Provider value={contextValue}>{children}</AuthProvider.Provider>;
};

export default AuthProvider;
