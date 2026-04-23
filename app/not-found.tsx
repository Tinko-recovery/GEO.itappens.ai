import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">404</p>
      <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        This page doesn&apos;t exist or was moved.
      </p>
      <Link href="/" className="text-sm font-medium text-indigo-600 underline underline-offset-4">
        Go home
      </Link>
    </div>
  );
}
