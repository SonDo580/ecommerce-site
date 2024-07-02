import { Role } from "@root/constants";

export interface CreateShopPayload {
    name: string;
    email: string;
    password: string;
    roles: Role[];
}