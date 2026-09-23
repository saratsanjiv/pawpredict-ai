import { get } from "@vercel/blob";
import { getCasePhotoPathname } from "@/lib/vet/cases";

export const dynamic = "force-dynamic";

// Streams a case photo from the private Blob store. The Blob path comes from the database,
// never from the request, so this can't be used to read anything else in the store.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pathname = await getCasePhotoPathname(id);
  if (!pathname) return new Response("Not found", { status: 404 });

  const result = await get(pathname, { access: "private", ifNoneMatch: req.headers.get("if-none-match") ?? undefined });
  if (!result) return new Response("Not found", { status: 404 });

  const headers: Record<string, string> = { "Cache-Control": "private, max-age=3600", ETag: result.blob.etag };
  if (result.statusCode === 304) return new Response(null, { status: 304, headers });

  headers["Content-Type"] = result.blob.contentType;
  headers["Content-Length"] = String(result.blob.size);
  return new Response(result.stream, { headers });
}
