import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const clients = await prisma.clientProfile.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ clients });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, status } = await req.json();
        const client = await prisma.clientProfile.update({
            where: { id },
            data: { status }
        });
        return NextResponse.json({ success: true, client });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
    }
}
