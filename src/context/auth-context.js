import React, { useState, createContext } from 'react';

export const AuthContext = createContext({
    isAuth: false,
    login: () => { }
});

const AuthContextProvider = props => {
    // the part of code i want to make it shared
    const [isAuth, setIsAuth] = useState(false);
    const  loginHandler = () => {
        setIsAuth(true);
    }

    return (
        <AuthContext.Provider value={{ isAuth: isAuth, login: loginHandler }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;