import { Message } from "@/lib/validators/message";

export async function POST(req: Request) {
  const message: Message = await req.json();
  const url = new URL(req.url);
  const baseUrl = url.origin;

  if (message.text.toLowerCase() === "start") {
    return Response.json({
      message:
        "Hi, I'm Webster, your Brgy. Assistant.\nPlease choose from the menu\n1 - Clearance request\n2 - Report an incident\n3 - Brgy Permit\n4 - Create an account",
    });
  }

  if (message.text === "1") {
    return Response.json({
      message: `Please go to <a href='${baseUrl}/pages/services'><u>this link</u></a> to request for a clearance.`,
    });
  } else if (message.text === "2") {
    return Response.json({
      message: `Please go to <a href='${baseUrl}/pages/services'><u>this link</u></a> to report an incident.`,
    });
  } else if (message.text === "3") {
    return Response.json({
      message: `Please go to <a href='${baseUrl}/pages/services'><u>this link</u></a> to request for a Brgy Permit.`,
    });
  } else if (message.text === "4") {
    return Response.json({
      message: `Please go to <a href='${baseUrl}/sign-up'><u>this link</u></a> to create an account.`,
    });
  }
  return Response.json({ message: "I'm sorry, I don't understand that." });
}
