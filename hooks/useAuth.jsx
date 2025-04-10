// Frontend - autentizace (hooks/useAuth.jsx)
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import axios from 'axios';

// Vytvoření kontextu
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  
  // Funkce pro přihlášení pomocí Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, provider);
      
      // Získání ID tokenu pro backend
      const idToken = await result.user.getIdToken();
      
      // Odeslání tokenu na backend
      const response = await axios.post('/api/auth/login', { token: idToken });
      
      // Uložení uživatele ze serveru (obsahuje roli, atd.)
      setUser(response.data.user);
      
      return response.data.user;
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      throw error;
    }
  };
  
  // Funkce pro odhlášení
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
    }
  };
  
  // Sledování stavu autentizace
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Získání ID tokenu
          const idToken = await firebaseUser.getIdToken();
          
          // Vytvoření interceptoru pro zasílání tokenu s každým požadavkem
          axios.interceptors.request.use(async (config) => {
            config.headers.Authorization = `Bearer ${idToken}`;
            return config;
          });
          
          // Získání uživatelských dat z backend API
          const response = await axios.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError(error.message);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [auth]);
  
  // Hodnoty poskytované kontextem
  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOrganization: user?.role === 'organization',
    isStudent: user?.role === 'student'
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pro použití autentizace
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
