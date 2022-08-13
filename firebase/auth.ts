import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


export default function handleLogin() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
    .catch((error) => {
        console.log("sign in with popup failed with error: " + error.toString()); 
        switch (error.code) {
            case "auth/cancelled-popup-request":
            case "auth/popup-closed-by-user":
                break;
            default:
                alert(error.toString()); // Should not be reached
        }
    })
}
