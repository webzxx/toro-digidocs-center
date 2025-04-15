import { db } from "@/lib/db";
import { UTApi } from "uploadthing/server";

/**
 * Deletes all proof of identity images for a resident
 * @param residentId The ID of the resident whose images should be deleted
 */
export async function deletePOIImages(residentId: number) {
  // Retrieve resident's image URLs in ProofOfIdentity
  const proofOfIdentity = await db.proofOfIdentity.findUnique({
    where: { residentId },
  });
  
  // Return if no proof of identity found
  if (!proofOfIdentity) {
    return;
  }
  
  const {
    signaturePath, idPhoto1Path, idPhoto2Path, holdingIdPhoto1Path, holdingIdPhoto2Path,
  } = proofOfIdentity;
  
  // Return if all paths are null
  if (!signaturePath && !idPhoto1Path && !idPhoto2Path && !holdingIdPhoto1Path && !holdingIdPhoto2Path) {
    return;
  }

  // Delete the files stored in uploadthing
  const utApi = new UTApi();
  
  const filesToDelete = [
    signaturePath, idPhoto1Path, idPhoto2Path, holdingIdPhoto1Path, holdingIdPhoto2Path,
  ]
    .filter(Boolean) // Remove nulls/undefined
    .map(path => path?.split("/").pop()!); // Extract filename from path
  
  if (filesToDelete.length > 0) {
    await utApi.deleteFiles(filesToDelete);
  }
}