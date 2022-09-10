import useFirebaseRef from "../hooks/useFirebaseRef";
import { UserObject } from "../interfaces";
import firebase from "../firebase";

interface UserParams {
    id: string
};

const User = ({ id } : UserParams) => {

    const [user, _] = useFirebaseRef(`users/${id}`);
    const userObj = user as unknown as UserObject

    return (
        <span>{userObj ? userObj.name : "..."}</span>
    );

}

export function GetUserNameFromId(id: string): string {
    const dbPath = `users/${id}`;
    const ref = firebase.database().ref(dbPath);
    let user: any;
    ref.on("value", (snapshot) => {
        user = snapshot.val();
    });
    const userObj = user as unknown as UserObject
    return userObj ? userObj.name : "...";
}

export async function GetUserNameFromIdNoHook(id: string): Promise<string> {
    const ref = firebase.database().ref(`users/${id}`);
    const getUser: Promise<any> = ref.once("value");
    let user = await Promise.resolve(getUser);
    return user.val().name;
}

export default User 