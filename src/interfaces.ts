
export interface UserObject {
    id: string,
    name: string,
};

export interface GameObject {
    createdAt: number,
    startedAt: number,
    endedAt: number,
    host: string,
    status: string,
    users: any[]
};
