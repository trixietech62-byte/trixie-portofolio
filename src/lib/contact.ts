export type ContactPayload = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type ContactResult = {
  success: boolean;
  message: string;
};

const DEFAULT_RECIPIENT = "trixietech17@gmail.com";
const SUBJECT_PREFIX = "New message from contact form";

function buildMailtoLink(payload: ContactPayload) {
  const subject = encodeURIComponent(`${SUBJECT_PREFIX}: ${payload.topic}`);
  const body = encodeURIComponent(
    `Name: ${payload.name}\nEmail: ${payload.email}\n\nMessage:\n${payload.message}`
  );

  return `mailto:${DEFAULT_RECIPIENT}?subject=${subject}&body=${body}`;
}

export async function sendContactEmail(payload: ContactPayload): Promise<ContactResult> {
  const { name, email, topic, message } = payload;

  if (!name?.trim() || !email?.trim() || !topic?.trim() || !message?.trim()) {
    return {
      success: false,
      message: "Please complete all fields before sending your message.",
    };
  }

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (serviceId && templateId && publicKey) {
    try {
      const response = await fetch("https://api.emailjs.com/api/v1.1/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: name,
            from_email: email,
            topic,
            message,
            to_email: DEFAULT_RECIPIENT,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Email delivery failed");
      }

      return {
        success: true,
        message: "Your message has been sent successfully!",
      };
    } catch {
      return {
        success: false,
        message: "Oops, something went wrong. Please try again later.",
      };
    }
  }

  try {
    window.open(buildMailtoLink(payload), "_blank", "noopener,noreferrer");
  } catch {
    return {
      success: false,
      message: "Oops, something went wrong. Please try again later.",
    };
  }

  return {
    success: true,
    message: "Your message has been sent successfully!",
  };
}
