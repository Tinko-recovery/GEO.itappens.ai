import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const audits = await prisma.audit.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json({ audits }, { status: 200 });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
