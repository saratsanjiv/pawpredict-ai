// Photos live at public/cases/<case id>.jpg — replace a file with a real photo of the same name.
export function casePhotoPath(id: string) {
  return `/cases/${id}.jpg`;
}

export function formatAgo(minutes: number) {
  return minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} h ago`;
}
