import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        const validUsername = process.env.ADMIN_USERNAME;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (credentials.username === validUsername && credentials.password === validPassword) {
          // Return a dummy user object with the authorized email so the rest of the app's whitelist works seamlessly
          return { id: "1", name: "Admin", email: "sadish.sugumaran@itappens.ai" };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/access-denied",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isTryingToAccessAdmin = nextUrl.pathname.startsWith('/admin');
      
      // We don't want to block public login and access denied pages
      if (nextUrl.pathname === '/admin/login' || nextUrl.pathname === '/admin/access-denied') {
        return true;
      }
      
      if (isTryingToAccessAdmin) {
        if (!isLoggedIn) return false;
        
        // Double check email whitelist at edge (just in case)
        if (auth.user?.email !== "sadish.sugumaran@itappens.ai") {
            return Response.redirect(new URL('/admin/access-denied', nextUrl));
        }
        return true;
      }
      return true;
    },
  },
  basePath: "/admin/api/auth",
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  }
})
