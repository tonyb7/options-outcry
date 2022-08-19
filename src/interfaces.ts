
export interface UserObject {
    id: string,
    name: string,
};

export interface GameObject {
    createdAt: number,
    host: string,
    status: string,
    users: any[]
};
