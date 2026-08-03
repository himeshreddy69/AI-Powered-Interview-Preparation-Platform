import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  auth,
  loginWithEmail,
  signupWithEmail,
  logoutUser
} from "../services/firebase/auth";


const AuthContext = createContext(null);



export function AuthProvider({ children }) {


  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    if (!auth) {

      setLoading(false);

      return undefined;

    }



    const unsubscribe = onAuthStateChanged(

      auth,

      (currentUser) => {

        setUser(currentUser);

        setLoading(false);

      }

    );


    return unsubscribe;


  }, []);





  const login = async (email, password) => {

    return loginWithEmail(
      email,
      password
    );

  };





  const signup = async (email, password) => {

    return signupWithEmail(
      email,
      password
    );

  };





  const logout = async () => {

    return logoutUser();

  };





  const value = useMemo(() => ({

    user,

    loading,

    login,

    signup,

    logout

  }), [

    user,

    loading

  ]);





  return (

    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>

  );

}





export function useAuth() {


  const context = useContext(AuthContext);



  if (!context) {

    throw new Error(
      "useAuth must be used within an AuthProvider."
    );

  }



  return context;


}