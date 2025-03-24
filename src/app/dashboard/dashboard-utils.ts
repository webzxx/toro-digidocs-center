import { db } from "@/lib/db";

export const StatusCounts = async () => {
  const status = await db.certificateRequest.findMany({
    select: {
      status: true
    }
  });
  
  const pendingCount = status.filter((s) => s.status === "PENDING").length;
  const processingCount = status.filter((s) => s.status === "PROCESSING").length;
  const completedCount = status.filter((s) => s.status === "COMPLETED").length;

  return { pendingCount, processingCount, completedCount };
};
