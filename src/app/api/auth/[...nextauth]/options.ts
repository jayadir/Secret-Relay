import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/model/User.model";
import { connect } from "@/lib/db";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                // name:{label:"Name",type:"text"},
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                try {
                    await connect();
                    const user = await User.findOne({ email: credentials.identifier.email });
                    if (!user) {
                        throw new Error("No user found");
                    }
                    if (!user.isVerified) {
                        throw new Error("User not verified");
                    }
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }
                    return user
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.name = user?.name;
                token._id = user?._id?.toString();
                token.isVerified = user?.isVerified;
                token.isAccepting = user?.isAccepting;
            }
            return token;
        },
        async session({ session, user, token }) {
            if (token) {
                session.user = {
                    _id: token?._id as string | undefined,
                    name: token?.name as string | undefined,
                    isVerified: token?.isVerified as boolean | undefined,
                    isAccepting: token?.isAccepting as boolean | undefined
                }
            }
            return session;
        }
    },
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.SECRET_AUTH_TOKEN,
}