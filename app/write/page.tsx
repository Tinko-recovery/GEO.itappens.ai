"use client";

import { useState } from "react";

export default function WriteBlog() {
    const [password, setPassword] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("GEO Intelligence");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin_itappens") {
            setIsAuthorized(true);
        } else {
            alert("Incorrect password.");
        }
    };

    const handleSave = async () => {
        if (!title || !content) return alert("Title and content are required.");
        
        setStatus("Saving...");
        try {
            const response = await fetch("/api/blog/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, category, excerpt, content, password }),
            });
            const data = await response.json();
            if (data.success) {
                setStatus("✅ Blog Published Successfully!");
                // Clear form
                setTitle("");
                setExcerpt("");
                setContent("");
            } else {
                setStatus("❌ Save failed: " + data.error);
            }
        } catch {
            setStatus("❌ Connection failed.");
        }
    };

    if (!isAuthorized) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F9FAFB', fontFamily: 'sans-serif' }}>
                <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', width: '320px' }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Admin Login</h2>
                    <input 
                        type="password" 
                        placeholder="Enter password" 
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', marginBottom: '16px' }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" style={{ width: '100%', padding: '12px', background: '#0D5D54', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Enter Writer
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px', fontFamily: 'sans-serif' }}>
            <h1 style={{ marginBottom: '32px' }}>Manual Blog Writer</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Post Title</label>
                    <input 
                        className="f-in"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="e.g., The Future of GEO" 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
                    <select 
                        className="f-in"
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option>GEO Fundamentals</option>
                        <option>Technical GEO</option>
                        <option>India GEO Market</option>
                        <option>Case Studies</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Golden Snippet (Excerpt)</label>
                    <textarea 
                        className="f-in"
                        style={{ height: '80px' }}
                        value={excerpt} 
                        onChange={(e) => setExcerpt(e.target.value)} 
                        placeholder="The 40-60 word high-density snippet for LLM citation."
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Blog Content (Markdown)</label>
                    <textarea 
                        className="f-in"
                        style={{ height: '400px', fontFamily: 'monospace' }}
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="# Heading 1\n\nWrite your blog here using markdown..."
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                        onClick={handleSave}
                        style={{ padding: '14px 28px', background: '#0D5D54', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Publish to Production
                    </button>
                    <span style={{ fontWeight: '600' }}>{status}</span>
                </div>
            </div>

            <style>{`
                .f-in { width: 100%; padding: 12px; border: 1.5px solid #E5E7EB; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
                .f-in:focus { border-color: #0D5D54; outline: none; }
            `}</style>
        </div>
    );
}
