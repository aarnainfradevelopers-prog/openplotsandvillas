/**
 * Speech Recognition Text Processing & Deduplication Utilities
 * Prevents Web Speech API from repeating consecutive words, phrases, and sentences.
 */

export function deduplicateRepeatedPhrases(text: string): string {
  if (!text) return '';
  let str = text.trim().replace(/\s+/g, ' ');

  let prev = '';
  let safetyCounter = 0;
  // Repeat passes until no further reduction occurs (handles 2x, 3x, 4x, 5x duplicates)
  while (str !== prev && safetyCounter < 10) {
    prev = str;
    safetyCounter++;
    const words = str.split(' ');
    const n = words.length;

    // 1. Check if the entire string repeats a pattern of words (e.g. phrase repeated 2, 3, 4, 5 times)
    let patternFound = false;
    if (n >= 4) {
      for (let len = Math.floor(n / 2); len >= 2; len--) {
        const pattern = words.slice(0, len).join(' ').toLowerCase();
        let count = 0;
        while (count * len + len <= n) {
          const chunk = words.slice(count * len, (count + 1) * len).join(' ').toLowerCase();
          if (chunk === pattern) {
            count++;
          } else {
            break;
          }
        }
        if (count >= 2 && count * len === n) {
          str = words.slice(0, len).join(' ');
          patternFound = true;
          break;
        }
      }
    }

    if (patternFound) continue;

    // 2. Check consecutive repeating sub-phrases of length from n/2 down to 2 words
    for (let len = Math.floor(words.length / 2); len >= 2; len--) {
      for (let i = 0; i <= words.length - 2 * len; i++) {
        const p1 = words.slice(i, i + len).join(' ').toLowerCase();
        const p2 = words.slice(i + len, i + 2 * len).join(' ').toLowerCase();
        if (p1 === p2) {
          words.splice(i + len, len);
          str = words.join(' ');
          patternFound = true;
          break;
        }
      }
      if (patternFound) break;
    }
  }

  return str.trim();
}

/**
 * Extracts and deduplicates transcripts from SpeechRecognition event results
 */
export function extractCleanTranscript(results: any): string {
  if (!results || results.length === 0) return '';

  let pieces: string[] = [];

  for (let i = 0; i < results.length; ++i) {
    const res = results[i];
    const text = (res[0]?.transcript || '').trim();
    if (!text) continue;

    const cleanText = text.replace(/\s+/g, ' ');

    if (pieces.length > 0) {
      const lastPiece = pieces[pieces.length - 1];
      // Skip if identical to the previous chunk
      if (lastPiece.toLowerCase() === cleanText.toLowerCase()) {
        continue;
      }
      // Skip if already completely contained in the previous chunk
      if (lastPiece.toLowerCase().includes(cleanText.toLowerCase())) {
        continue;
      }
      // If the current chunk is a superset of the last chunk, replace it
      if (cleanText.toLowerCase().includes(lastPiece.toLowerCase())) {
        pieces[pieces.length - 1] = cleanText;
        continue;
      }
    }

    pieces.push(cleanText);
  }

  const rawCombined = pieces.join(' ').trim();
  return deduplicateRepeatedPhrases(rawCombined);
}
