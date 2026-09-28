const SAFE_FILENAME_RE = /^[a-z0-9][a-z0-9._-]{0,63}$/i;

/** Sanitize a slug for Content-Disposition attachment names. */
export function safeDownloadFilename(slug: string, suffix = "export.csv") {
  const base = slug.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const stem = base.replace(/^-+|-+$/g, "").slice(0, 48) || "download";
  const name = `${stem}-${suffix}`;
  if (!SAFE_FILENAME_RE.test(name)) {
    return `download-${suffix}`;
  }
  return name;
}

export function contentDispositionAttachment(filename: string) {
  const safe = filename.replace(/[\r\n"\\]/g, "");
  return `attachment; filename="${safe}"`;
}
