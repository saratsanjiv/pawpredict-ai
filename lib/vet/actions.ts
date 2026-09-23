"use server";

import { revalidatePath } from "next/cache";
import { updateCaseStatus } from "./cases";

export async function setCaseReviewStatus(id: string, reviewed: boolean): Promise<void> {
  await updateCaseStatus(id, reviewed ? "reviewed" : "new");
  revalidatePath("/vet");
  revalidatePath(`/vet/case/${id}`);
}
