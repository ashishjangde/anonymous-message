import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/dbConfig";  // Assuming this is the Prisma client

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.email },
                { username: credentials.email },
              ]
            }
          });

          if (!user) {
            return null;
          }

          const stringPassword = credentials.password.toString();
          const checkPassword = await bcryptjs.compare(stringPassword, user.password);
          if (!checkPassword) {
            return null;
          }

          return {
            ...user,
            id: user.id.toString(), 
          };

        } catch (err) {
          console.error(err);
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    }
  },

  logger: {
    error: () => {
      // console.error(message);
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/sign-in',
  },
});
