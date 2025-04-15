import { nanoid } from "nanoid";

export function generateTransactionRef(prefix = "TR"){
  // Format: TR-YYYYMMDD-XXXXX (where X is alphanumeric)
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0");
    
  // Generate 5 character unique ID
  const uniqueId = nanoid(5).replace(/[^A-Z0-9]/g, () => {
    // Generate random alphanumeric character if not A-Z or 0-9
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }).toUpperCase();
    
  return `${prefix}-${dateStr}-${uniqueId}`;
};

export function generateFile(file: File): File {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0");
  const fileName = `${dateStr}-payment-proof-${file.name.replaceAll(" ", "_")}`;
  return new File([file], fileName, { type: file.type });
}