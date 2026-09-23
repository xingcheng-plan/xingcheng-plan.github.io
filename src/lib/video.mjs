export function describeVideo(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return { playable: false, src: null };
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
