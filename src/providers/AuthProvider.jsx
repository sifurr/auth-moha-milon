import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import auth from "../firebase/firebase.config";
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

export const AuthContext = createContext(null)
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () =>{
        setLoading(true)
        return signOut(auth);
    }

    const signInWithGoogle = () =>{
        setLoading(true)
        return signInWithPopup(auth, googleProvider);
    }

    // observe auth state change
    // it holds the state if anything is changed anywhere else
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);            
            console.log('Observing the current user value inside the useEffect of AuthProvider', currentUser);
            setLoading(false)
        })

        // call and return the unsubscribe function
        return () => {
            unsubscribe()
        }

    }, [])

    const authInfo = { user, loading, createUser, signInUser, signInWithGoogle, logOut }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node
}

export default AuthProvider;