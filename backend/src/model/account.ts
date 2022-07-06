export interface Account {
    username: string;
    email: string;
    address?: Address
}

export interface Address {
    street: string;
    zipCode: number;
    city: string;
}

