"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export default function AuditForm() {
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          website: formData.get("website"),
          visibility: formData.get("visibility"),
        }),
      });

      setState(response.ok ? "success" : "error");
      if (response.ok) {
        event.currentTarget.reset();
      }
    } catch {
      setState("error");
    }
  }

  return (
    <div className="card">
      <form className="audit-form" onSubmit={handleSubmit}>
        <div className="grid-form-row">
          <label>
            Name
            <input name="name" type="text" placeholder="Priya Sharma" />
          </label>
          <label>
            Business email
            <input name="email" type="email" placeholder="you@company.com" required />
          </label>
        </div>
        <label>
          Website
          <input name="website" type="url" placeholder="https://yourcompany.com" required />
        </label>
        <label>
          Current AI visibility
          <select name="visibility" defaultValue="">
            <option value="">Select one</option>
            <option value="never">We are not cited today</option>
            <option value="some">We appear occasionally</option>
            <option value="competitor">Competitors appear instead of us</option>
            <option value="unknown">We have not measured it yet</option>
          </select>
        </label>
        <button className="btn-primary" type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Submitting..." : "Request Free AI Audit"}
        </button>
        {state === "success" ? (
          <p className="status-note success">Audit request received. The team will respond from hello@itappens.ai.</p>
        ) : null}
        {state === "error" ? (
          <p className="status-note error">Submission failed. Email hello@itappens.ai directly.</p>
        ) : null}
      </form>
    </div>
  );
}
