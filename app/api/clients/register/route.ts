import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            businessName, 
            websiteUrl, 
            email, 
            industry, 
            niche, 
            targetAudience, 
            bufferAccessToken,
            linkedinProfileId,
            twitterProfileId,
            instagramProfileId 
        } = body;

        // Create the client profile in Supabase via Prisma
        const client = await prisma.clientProfile.create({
            data: {
                businessName,
                websiteUrl,
                email,
                industry,
                niche,
                targetAudience,
                bufferAccessToken,
                linkedinProfileId,
                twitterProfileId,
                instagramProfileId,
                status: "AWAITING_PAYMENT"
            }
        });

        // ── TELEGRAM NOTIFICATION (Optional but recommended for the founder) ─────
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (botToken && chatId) {
            const message = `🚀 *New Client Onboarded!*\n\n*Business:* ${businessName}\n*Website:* ${websiteUrl}\n*Email:* ${email}\n*Niche:* ${niche}\n\n*Action:* Collect ₹999 and activate in Dashboard.`;
            
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: "Markdown"
                })
            });
        }

        return NextResponse.json({ success: true, token: client.token });

    } catch (error: any) {
        console.error("Onboarding Error:", error);
        return NextResponse.json({ 
            error: error.code === 'P2002' ? "This email is already registered." : "Failed to register client." 
        }, { status: 500 });
    }
}
