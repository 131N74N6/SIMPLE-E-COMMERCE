export type User = {
    status: string;
    token: string;
    info: {
        id: string;
        email: string;
        username: string;
    }
}