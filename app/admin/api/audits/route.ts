import { NextRequest, NextResponse } from "next/server";
import { runAeoAudit } from "@/lib/engines/aeo-audit";
import { runSeoAudit } from "@/lib/engines/seo-audit";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.email !== "sadish.sugumaran@itappens.ai") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clientId, auditId, type } = await request.json();

    if (!clientId || !auditId || !type) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Trigger in the background (don't await)
    if (type === "aeo") {
      runAeoAudit(clientId, auditId).catch(console.error);
    } else if (type === "seo") {
      runSeoAudit(clientId, auditId).catch(console.error);
    } else {
      return NextResponse.json({ error: "Invalid audit type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Audit triggered successfully" });
  } catch (error) {
    console.error("Audit trigger error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
