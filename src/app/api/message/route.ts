import { Message } from "@/lib/validators/message";
import { barangayInfo } from "@/lib/data/faqs";
import { chatLinks } from "@/lib/data/chatLinks";
import { 
  getUserCertificateStatuses, 
  getUserAppointmentStatuses,
  getCertificateByReferenceNumber,
  getAppointmentByReferenceNumber, 
} from "@/lib/data/userStatuses";
import getSession from "@/lib/auth/getSession";
import { isStatusQuery, getEnhancedSystemPrompt } from "@/lib/utils/ai";
import { formatDateTime, formatDateOnly, extractReferenceNumber, formatEnumValue } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(req: Request) {
  // Handle simple menu-based responses first
  try {
    const message: Message = await req.json();
    const url = new URL(req.url);
    const baseUrl = url.origin;
    const session = await getSession();
    
    // Check for menu options or quick responses
    if (message.text.toLowerCase() === "start") {
      return Response.json({
        message: chatLinks.welcomeMessage,
      });
    }

    // Check if the message matches any of our predefined options
    if (message.text in chatLinks.options) {
      const option = chatLinks.options[message.text as keyof typeof chatLinks.options];
      const formattedMessage = option.message.replace("{baseUrl}", baseUrl);
      return Response.json({ message: formattedMessage });
    }
    
    // Use our new utility to check if this is a status query
    const statusQuery = isStatusQuery(message.text);
    
    // Extract reference number if present
    const referenceNumber = extractReferenceNumber(message.text);
    console.log("Extracted reference number:", referenceNumber);
    // Handle status inquiries if user is logged in
    if (statusQuery && session?.user) {
      const userId = parseInt((session.user as any).id);
      
      // If a specific reference number is provided
      if (referenceNumber) {
        // Check if it's a certificate reference (VVFJ-)
        if (referenceNumber.startsWith("VVFJ-")) {
          const result = await getCertificateByReferenceNumber(referenceNumber);
          if (result.success && result.certificate) {
            const cert = result.certificate;
            return Response.json({
              message: `Found certificate request ${referenceNumber}:\n\n` +
                `Type: ${formatEnumValue(cert.type)}\n` +
                `Status: ${formatEnumValue(cert.status)}\n` +
                `Requested: ${formatDateOnly(cert.requestDate)}\n` +
                `Resident: ${cert.resident}\n` +
                `Purpose: ${cert.purpose}\n` +
                (cert.paymentStatus ? `Payment: ${formatEnumValue(cert.paymentStatus)}\n` : "") +
                (cert.remarks ? `Remarks: ${cert.remarks}` : ""),
            });
          } else {
            return Response.json({
              message: `I couldn't find a certificate request with reference number ${referenceNumber}. Please check if the reference number is correct.`,
            });
          }
        }
        
        // Check if it's an appointment reference (APPT-)
        if (referenceNumber.startsWith("APPT-")) {
          const result = await getAppointmentByReferenceNumber(referenceNumber);
          if (result.success && result.appointment) {
            const appt = result.appointment;
            return Response.json({
              message: `Found appointment ${referenceNumber}:\n\n` +
                `Type: ${formatEnumValue(appt.type)}\n` +
                `Status: ${formatEnumValue(appt.status)}\n` +
                `Preferred Date: ${formatDateOnly(appt.preferredDate)}\n` +
                `Preferred Time: ${formatEnumValue(appt.preferredTimeSlot)}\n` +
                (appt.scheduledDateTime ? `Scheduled for: ${formatDateTime(appt.scheduledDateTime)}\n` : "") +
                (appt.resident ? `Resident: ${appt.resident}\n` : "") +
                (appt.notes ? `Notes: ${appt.notes}` : ""),
            });
          } else {
            return Response.json({
              message: `I couldn't find an appointment with reference number ${referenceNumber}. Please check if the reference number is correct.`,
            });
          }
        }
      }
      
      // Check if query is about certificates
      if (message.text.toLowerCase().includes("certificate") || 
          message.text.toLowerCase().includes("clearance") || 
          message.text.toLowerCase().includes("id")) {
        const result = await getUserCertificateStatuses(userId);
        if (result.success && result.certificates && result.certificates.length > 0) {
          const recentCerts = result.certificates.slice(0, 3); // Show only recent 3
          const certsList = recentCerts.map(cert => 
            `- Ref#: ${cert.referenceNumber}, Type: ${formatEnumValue(cert.type)}, Status: ${formatEnumValue(cert.status)}, Date: ${formatDateOnly(cert.requestDate)}`,
          ).join("\n");
          
          return Response.json({
            message: `Here are your recent certificate requests:\n\n${certsList}\n\nFor more details about a specific request, please provide the reference number.`,
          });
        } else {
          return Response.json({
            message: result.message || "You don't have any certificate requests yet. You can apply for one through our services page.",
          });
        }
      }
      
      // Check if query is about appointments
      if (message.text.toLowerCase().includes("appointment") || 
          message.text.toLowerCase().includes("schedule") || 
          message.text.toLowerCase().includes("meeting")) {
        const result = await getUserAppointmentStatuses(userId);
        if (result.success && result.appointments && result.appointments.length > 0) {
          const recentAppts = result.appointments.slice(0, 3); // Show only recent 3
          const apptsList = recentAppts.map(appt => 
            `- Ref#: ${appt.referenceNumber}, Type: ${formatEnumValue(appt.type)}, Status: ${formatEnumValue(appt.status)}, ${appt.scheduledDateTime ? `Scheduled: ${formatDateTime(appt.scheduledDateTime)}` : `Preferred: ${formatDateOnly(appt.preferredDate)} (${formatEnumValue(appt.preferredTimeSlot)})`}`,
          ).join("\n");
          
          return Response.json({
            message: `Here are your recent appointments:\n\n${apptsList}\n\nFor more details about a specific appointment, please provide the reference number.`,
          });
        } else {
          return Response.json({
            message: result.message || "You don't have any appointments scheduled yet. You can request one through our services page.",
          });
        }
      }
      
      // General status query - show both certificates and appointments
      const certResult = await getUserCertificateStatuses(userId);
      const apptResult = await getUserAppointmentStatuses(userId);
      
      let responseMessage = "";
      
      if (certResult.success && certResult.certificates && certResult.certificates.length > 0) {
        const recentCerts = certResult.certificates.slice(0, 2); // Show only recent 2
        const certsList = recentCerts.map(cert => 
          `- Ref#: ${cert.referenceNumber}, Type: ${formatEnumValue(cert.type)}, Status: ${formatEnumValue(cert.status)}`,
        ).join("\n");
        
        responseMessage += `Your recent certificate requests:\n\n${certsList}\n\n`;
      }
      
      if (apptResult.success && apptResult.appointments && apptResult.appointments.length > 0) {
        const recentAppts = apptResult.appointments.slice(0, 2); // Show only recent 2
        const apptsList = recentAppts.map(appt => 
          `- Ref#: ${appt.referenceNumber}, Type: ${formatEnumValue(appt.type)}, Status: ${formatEnumValue(appt.status)}`,
        ).join("\n");
        
        responseMessage += `Your recent appointments:\n\n${apptsList}\n\n`;
      }
      
      if (responseMessage) {
        responseMessage += "For more details about a specific item, please provide the reference number.";
        return Response.json({ message: responseMessage });
      }
    }
    
    // If the user is asking about statuses but isn't logged in
    if (statusQuery && !session?.user) {
      return Response.json({
        message: "You need to be logged in to check your certificate or appointment status. Please sign in first and then try again.",
      });
    }

    // If not a simple menu option, use AI response
    const { messages } = { messages: [{ role: "user", content: message.text }] };

    // Filter out potential prompt injection attempts
    const sanitizedMessages = messages.map(msg => {
      if (msg.role === "user") {
        const content = msg.content.toString();
        
        // Check for common prompt injection patterns
        const promptInjectionPatterns = [
          /ignore( all)? (previous|prior|above|earlier) instructions/i,
          /what are your (prompt|system|initial) (details|instructions|messages)/i,
          /tell me your instructions/i,
          /system prompt/i,
          /reveal your prompts/i,
          /give me the exact text/i,
        ];

        // If the message contains prompt injection patterns, replace with a safe message
        if (promptInjectionPatterns.some(pattern => pattern.test(content))) {
          return {
            ...msg,
            content: "I'd like information about barangay services.",
          };
        }
      }
      return msg;
    });

    // Create a system message with the barangay information
    const barangayContext = JSON.stringify({
      ...barangayInfo,
      quickLinks: chatLinks.options,
      isLoggedIn: !!session?.user,
    });
    
    // Use our enhanced system prompt that includes status checking capabilities
    const systemMessage = {
      role: "system",
      content: getEnhancedSystemPrompt(barangayContext),
    };

    // Prepend the system message to the sanitized messages array
    const augmentedMessages = [systemMessage, ...sanitizedMessages];

    // Log the augmented messages for debugging
    console.log("Augmented messages:", augmentedMessages);

    // Use fetch to call OpenRouter API without streaming
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", // Required for OpenRouter
          "X-Title": "Barangay Chatbot",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: augmentedMessages,
          temperature: 0.5,
          max_tokens: 700,
          stream: false, // Set to false for non-streaming response
        }),
      });

      const data = await response.json();
      console.log("OpenRouter response:", data);
      
      // Return just the assistant's message
      return Response.json({ 
        message: data.choices[0].message.content, 
      });
    } catch (error) {
      console.error("Error calling OpenRouter:", error);
      return Response.json({ error: "Failed to communicate with AI service" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error processing message:", error);
    return Response.json({ message: chatLinks.fallbackMessage });
  }
}
