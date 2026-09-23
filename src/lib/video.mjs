export function describeVideo(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return { playable: false, src: null };
  }

  if (/^\/videos\/[a-z0-9-]+\.mp4$/i.test(value.trim())) {
    return { playable: true, src: value.trim() };
  }

  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:') {
      return { playable: false, src: null };
    }
    return { playable: true, src: url.toString() };
  } catch {
    return { playable: false, src: null };
  }
}
