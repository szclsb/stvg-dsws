export interface Account {
    username: string;
    email: string;
    roles?: string[];
    address?: Address;
}

export interface Address {
    street: string;
    zipCode: number;
    city: string;
}

