export type Role = {
    id: number;
    name: string;
}

export type Auth = {
    id: number,
    role: Role,
    name: string,
    email: string
}