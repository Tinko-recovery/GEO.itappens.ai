import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const email = credentials.email as string;
        const password = credentials.password as string;

        // Dynamically import to avoid breaking Next.js Edge Middleware
        const { prisma } = await import("@/lib/db");
        const bcrypt = await import("bcryptjs").then(m => m.default || m);

        const employee = await prisma.employee.findUnique({
          where: { email }
        });

        if (!employee) return null;

        const isPasswordValid = await bcrypt.compare(password, employee.passwordHash);

        if (isPasswordValid) {
          return { id: employee.id, name: employee.name || "Employee", email: employee.email };
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
      
      if (nextUrl.pathname === '/admin/login' || nextUrl.pathname === '/admin/access-denied') {
        return true;
      }
      
      if (isTryingToAccessAdmin) {
        if (!isLoggedIn) return false;
        
        if (!auth.user?.email?.endsWith("@itappens.ai")) {
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
