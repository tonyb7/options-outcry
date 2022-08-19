import useFirebaseRef from "../hooks/useFirebaseRef"

interface UserParams {
    id: string
};

export interface UserObject {
    id: string,
    name: string,
}

const User = ({ id } : UserParams) => {

    const [user, _] = useFirebaseRef(`users/${id}`);
    const userObj = user as unknown as UserObject

    return (
        <span>{userObj ? userObj.name : "..."}</span>
    );

}

export default User 