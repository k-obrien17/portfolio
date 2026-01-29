"use server";

import { Resend } from "resend";

interface ContactResult {
  success: boolean;
  message: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  // Validate inputs
  if (!name || !email || !message) {
    return {
      success: false,
      message: "Please fill in all fields.",
    };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  // Escape HTML to prevent XSS in email
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  try {
    // If no API key, fall back to logging (for development)
    if (!process.env.RESEND_API_KEY) {
      console.log("Contact form submission (no RESEND_API_KEY set):", {
        name,
        email,
        message,
      });
      return {
        success: true,
        message: "Thank you for your message! I'll get back to you soon.",
      };
    }

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Change to your verified domain
      to: "keith@totalemphasis.com",
      replyTo: email,
      subject: `New inquiry from ${esc(name)}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h2>New Portfolio Inquiry</h2>
        <p><strong>From:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${esc(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        message: "Failed to send message. Please try emailing me directly.",
      };
    }

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you within 24 hours.",
    };
  } catch (error) {
    console.error("Failed to send message:", error);
    return {
      success: false,
      message: "Something went wrong. Please try emailing me directly at keith@totalemphasis.com",
    };
  }
}
