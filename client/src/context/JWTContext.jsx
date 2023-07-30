import PropTypes from "prop-types";
import { createContext, useEffect, useReducer } from "react";

// third-party

import jwtDecode from "jwt-decode";

// reducer - state management
import { LOGIN, LOGOUT } from "../reducers/actions";
import accountReducer from "../reducers/accountReducer";
import axios from "../api/axios";

// constant
const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  loading: true,
  user: null,
};

const verifyToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken);
  // console.log('==============decoded token==================');
  // console.log(decoded);
  // console.log('=============================================');
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const getaccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? accessToken : null;
};

const setSession = (accessToken,profile) => {
  if (accessToken) {
    console.log("accestoken find");

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("profile", JSON.stringify(profile));
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    console.log("accestoken Not find");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profile");
    localStorage.clear();
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const profile =JSON.parse(localStorage.getItem("profile")) ;
    
        if (accessToken) {
          setSession(accessToken,profile);
          console.log("accestoken find in useefftect");
          const {id,role}=profile;
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              loading: false,
              user: {
                id,
               role,
              },
            },
          });
          // const response = await axios.get('/users/profile');
          // const user = response.data;
          // dispatch({
          //     type: LOGIN,
          //     payload: {
          //         isLoggedIn: true,
          //         user: { ...user, name: `${user.firstName} ${user.lastName}` }
          //     }
          // });
        } else {
          console.log("accestoken Not find in useefftect");
          setSession(null);
          dispatch({
            type: LOGOUT,
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT,
        });
      }
    };

    init();
  }, []);

  // eslint-disable-next-line consistent-return
  const login = async (email, password) => {
    try {
      const res = await axios.post("/employees/login", { email, password });
      console.log(res.data);
      const profile={id:res.data.profile.id,role:res.data.profile.role}
      setSession(res.data.accessToken,profile);
      const { id, role } = profile;
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user: {
            id,
            role,
          },
        },
      });
    } catch (err) {
       throw err;
    }
  };

  const logout = () => {
    setSession(null,null);
    dispatch({ type: LOGOUT });
  };

  const forgetPassword = async (email) => {
    const response = await axios.post("/employees/mail", {
      email,
    });
   
    console.log(response);
    return response.data;
  };

  const resetPassword = async (email, token, password) => {
    try {
      const response = await axios.post("/employees/resetpassword", {
        email,
        token,
        password,
      });
    } catch (error) {
      throw error;
    }
   
  };

  return (
    <JWTContext.Provider
      value={{
        ...state,
        login,
        logout,
        getaccessToken,
        resetPassword,
        forgetPassword,
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node,
};

export default JWTContext;
