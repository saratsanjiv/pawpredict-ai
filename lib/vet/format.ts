// Case photos live in a private Blob store and are served through this app route.
export function casePhotoPath(id: string) {
  return `/vet/case/${id}/photo`;
}

export function formatAgo(minutes: number) {
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 48 * 60) return `${Math.floor(minutes / 60)} h ago`;
  return `${Math.floor(minutes / (24 * 60))} d ago`;
}
