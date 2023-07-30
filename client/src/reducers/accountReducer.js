// action - state management
import { LOGIN, LOGOUT, REGISTER } from './actions';

// ==============================|| ACCOUNT REDUCER ||============================== //

const initialState = {
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    loading:true,
};


const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER: {
            const { user } = action.payload;
            return {
                ...state,
                loading:false,
                user
            };
        }
        case LOGIN: {
            const { user } = action.payload;
          
            return {
                ...state,
             isAdmin:user.role==='1234' || user.role==='4567' ?true:false,
                // isAdmin:true,
                isLoggedIn: true,
                loading:false,
                user:user
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isLoggedIn: false,
                loading:false,
                user: null
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
