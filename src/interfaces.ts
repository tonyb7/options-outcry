
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

export interface OptionQuoteProps {
    bidString: string,
    askString: string
}
