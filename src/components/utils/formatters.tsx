/**
 * Formats religion for display
 */
export const formatReligion = (religion: string | null) => {
  switch (religion) {
  case "CATHOLIC":
    return "Catholic";
  case "IGLESIA_NI_CRISTO":
    return "Iglesia ni Cristo";
  case "AGLIPAY":
    return "Aglipay";
  case "BAPTIST":
    return "Baptist";
  case "DATING_DAAN":
    return "Dating Daan";
  case "ISLAM":
    return "Islam";
  case "JEHOVAHS_WITNESSES":
    return "Jehovah's Witnesses";
  case "OTHERS":
    return "Others";
  default:
    return "N/A";
  }
};
