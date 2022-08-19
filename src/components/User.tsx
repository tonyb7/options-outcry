import useFirebaseRef from "../hooks/useFirebaseRef"
import { UserObject } from "../interfaces"

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

export default User 