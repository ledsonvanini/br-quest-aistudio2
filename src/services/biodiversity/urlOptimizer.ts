/**
 * Otimizador de URLs de Mídia de Biodiversidade
 * Converte URLs de Wikimedia, Unsplash e iNaturalist para as resoluções adequadas
 */

export function getOptimizedBiodiversityImageUrl(
  rawUrl?: string,
  size: 'thumb' | 'card' | 'full' = 'card'
): string {
  if (!rawUrl) return '';
  const clean = rawUrl.trim();
  if (!clean) return '';

  // 1. Wikimedia Commons CDN
  if (clean.includes('upload.wikimedia.org/wikipedia/commons/')) {
    const targetPx = size === 'full' ? '1000px' : '320px';

    if (clean.includes('/thumb/')) {
      return clean.replace(/\/\d+px-([^/]+)$/, `/${targetPx}-$1`);
    }

    const commonsMatch = clean.match(/wikipedia\/commons\/([a-f0-9]\/[a-f0-9]{2}\/([^/]+))$/i);
    if (commonsMatch) {
      const relPath = commonsMatch[1];
      const fileName = commonsMatch[2];
      return `https://upload.wikimedia.org/wikipedia/commons/thumb/${relPath}/${targetPx}-${fileName}`;
    }
    return clean;
  }

  // 2. Unsplash CDN
  if (clean.includes('images.unsplash.com')) {
    try {
      const urlObj = new URL(clean);
      if (size === 'thumb' || size === 'card') {
        urlObj.searchParams.set('w', '360');
        urlObj.searchParams.set('h', '360');
        urlObj.searchParams.set('fit', 'crop');
        urlObj.searchParams.set('crop', 'faces,center');
        urlObj.searchParams.set('q', '80');
        urlObj.searchParams.set('auto', 'format');
      } else {
        urlObj.searchParams.set('w', '1200');
        urlObj.searchParams.set('q', '85');
        urlObj.searchParams.set('auto', 'format');
      }
      return urlObj.toString();
    } catch {
      return clean;
    }
  }

  // 3. iNaturalist CDN (/small.jpg ~240px, /medium.jpg ~500px, /large.jpg ~1024px)
  if (clean.includes('inaturalist-open-data') || clean.includes('inaturalist.org')) {
    if (size === 'thumb' || size === 'card') {
      return clean.replace(/\/(large|original|square)\.(jpg|jpeg|png)/i, '/medium.$2');
    } else {
      return clean.replace(/\/(square|small|medium)\.(jpg|jpeg|png)/i, '/large.$2');
    }
  }

  return clean;
}
