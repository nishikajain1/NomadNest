import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "./firebaseConfig";

export const handleGoogleSignIn = async (navigate) => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("User signed in:", result.user);
        navigate("/");
        return result.user;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
};


export const handleSignOut = async () => {
    try {
        await signOut(auth);
        console.log("User signed out");
    } catch (error) {
        console.error("Error signing out:", error);
    }
};
