import { signIn } from "@/lib/auth";
import BrandLogo from "@/components/BrandLogo";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col items-center">
        <BrandLogo color="white" />
        <h1 className="text-2xl font-bold text-white mt-8 mb-2">Agency Automation Platform</h1>
        <p className="text-zinc-400 text-center text-sm mb-8">
          Restricted access. Authorized personnel only.
        </p>

        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
          className="w-full space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder="employee@itappens.ai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
