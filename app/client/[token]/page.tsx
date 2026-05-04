import { prisma } from "@/lib/db";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";
import { notFound } from "next/navigation";

export default async function ClientPortal(props: { params: Promise<{ token: string }> }) {
    const { token } = await props.params;
    const client = await prisma.clientProfile.findUnique({
        where: { token: token },
        include: { posts: { orderBy: { createdAt: 'desc' }, take: 10 } }
    });

    if (!client) return notFound();

    return (
        <div className="page-shell">
            <NavBar />
            <main className="container animate-in" style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '60px' }}>
                        <span className="overline" style={{ color: 'var(--brand-blue)' }}>Client Command Center</span>
                        <h1 className="headline-lg">{client.businessName}</h1>
                        <p className="text-sub" style={{ marginTop: '16px' }}>
                            Your autonomous AI workforce is currently in <b>{client.status}</b> mode.
                        </p>
                    </div>

                    <div className="grid-2col" style={{ gap: '32px' }}>
                        {/* Status Card */}
                        <div className="card-glass" style={{ padding: '32px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Profile Details</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
                                <div>
                                    <span style={{ opacity: 0.6, display: 'block' }}>Niche</span>
                                    <span style={{ fontWeight: 600 }}>{client.niche}</span>
                                </div>
                                <div>
                                    <span style={{ opacity: 0.6, display: 'block' }}>Target Audience</span>
                                    <span style={{ fontWeight: 600 }}>{client.targetAudience}</span>
                                </div>
                                <div>
                                    <span style={{ opacity: 0.6, display: 'block' }}>Industry</span>
                                    <span style={{ fontWeight: 600 }}>{client.industry}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card-glass" style={{ padding: '32px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Recent AI Output</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {client.posts.length === 0 ? (
                                    <p style={{ opacity: 0.5, fontSize: '14px' }}>Your first automated post is scheduled for tomorrow 7:00 AM IST.</p>
                                ) : (
                                    client.posts.map((post) => (
                                        <div key={post.id} style={{ padding: '16px', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-blue)' }}>{post.platform}</span>
                                                <span style={{ fontSize: '11px', opacity: 0.5 }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p style={{ fontSize: '13px', opacity: 0.9, whiteSpace: 'pre-wrap' }}>{post.content}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
