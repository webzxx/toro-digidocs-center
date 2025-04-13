// This file contains quick links and responses for the chatbot
import { barangayInfo } from "./faqs";

export const chatLinks = {
  // Menu options for the chat
  welcomeMessage: "Hi, I'm Webster, your Brgy. Assistant.\nPlease choose from the menu or ask me any question about Barangay Bahay Toro:\n1 - Request Certificates or Permits\n2 - Report an incident\n3 - Schedule an appointment\n4 - Create an account",
  
  // Quick link responses
  options: {
    "1": {
      description: "Request Certificates or Permits",
      link: "/pages/services",
      message: "Please go to <a href='{baseUrl}/pages/services'><u>this link</u></a> to request for certificates or permits.",
    },
    "2": {
      description: "Report an incident",
      link: "/pages/services",
      message: "Please go to <a href='{baseUrl}/pages/services'><u>this link</u></a> to report an incident.",
    },
    "3": {
      description: "Schedule an appointment",
      link: "/dashboard/appointments",
      message: "To schedule an appointment, you'll need to have an account first. Please <a href='{baseUrl}/sign-up'><u>create an account</u></a> if you don't have one, then visit <a href='{baseUrl}/dashboard/appointments'><u>the appointments page</u></a>.",
    },
    "4": {
      description: "Create an account",
      link: "/sign-up",
      message: "Please go to <a href='{baseUrl}/sign-up'><u>this link</u></a> to create an account.",
    },
  },
  
  fallbackMessage: "I'm sorry, I couldn't understand your request. Please try again or choose from the menu options.",
};