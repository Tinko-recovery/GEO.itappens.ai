import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  excerpt: z.string(),
  content: z.string().min(1),
  published: z.boolean().default(false),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email?.endsWith("@itappens.ai")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employee = await prisma.employee.findUnique({
    where: { email: session.user.email }
  });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 403 });
  }

  try {
    const json = await req.json();
    const data = createSchema.parse(json);

    const post = await prisma.blogPost.create({
      data: {
        ...data,
        authorId: employee.id,
      }
    });

    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email?.endsWith("@itappens.ai")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true, email: true } } }
  });

  return NextResponse.json(posts);
}
