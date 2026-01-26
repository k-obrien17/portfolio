"use client";

import { useState } from "react";
import { submitContact } from "./actions";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");

    const result = await submitContact(formData);

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  }

  if (status === "success") {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800">{message}</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 transition-colors resize-none"
          placeholder="Your message..."
        />
      </div>

      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
