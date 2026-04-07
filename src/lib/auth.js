import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DB,
  }),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      const email = (user?.email || token?.email || "").toLowerCase();
      if (email) {
        token.email = email;
        token.role = adminEmails.includes(email) ? "admin" : "user";
      }
      if (user?.name) {
        token.name = user.name;
      }
      if (user?.image) {
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token?.role || "user";
        session.user.email = token?.email || session.user.email;
        session.user.name = token?.name || session.user.name;
        session.user.image = token?.picture || session.user.image;
      }
      return session;
    },
  },
};
