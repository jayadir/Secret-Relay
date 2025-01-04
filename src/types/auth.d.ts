import "next-auth"
import { DefaultSession } from "next-auth";
declare module "next-auth" {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAccepting?: boolean;
    }
    interface Session {
        user: {
            _id?: string;
            name?: string;
            isVerified?: boolean;
            isAccepting?: boolean;
        } & DefaultSession['user']
    }
}