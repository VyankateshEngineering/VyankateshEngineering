import fs from 'fs';
import path from 'path';

/**
 * Scans a folder under the `public` directory and returns a list of relative image paths.
 * Works at server runtime or build time.
 */
export function getFolderImages(folderName: string): string[] {
  try {
    const dirPath = path.join(process.cwd(), 'public', folderName);
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    const files = fs.readdirSync(dirPath);
    return files
      .filter(file => /\.(png|jpe?g|webp|svg)$/i.test(file))
      .map(file => `/${folderName}/${file}`);
  } catch (error) {
    console.error(`Failed to scan images in public/${folderName}:`, error);
    return [];
  }
}

/**
 * Automatically maps scanned images from a folder to an array of items (like Products or Gallery items)
 * matching their slug or ID.
 */
export function mapFolderImages<T extends { id: string; slug?: string; url?: string; images?: { url: string }[] }>(
  items: T[],
  folderName: string,
  fallbackImage: string = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231a1a1a%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%234a4a4a%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EImage%20Coming%20Soon%3C%2Ftext%3E%3C%2Fsvg%3E'
): T[] {
  const allImages = getFolderImages(folderName);
  
  return items.map(item => {
    const key = (item.slug || item.id).toLowerCase();
    
    // Find all images that match the key (e.g. "core-pins.png", "core-pins_1.png", "fixed-insert.jpg")
    const matched = allImages.filter(img => {
      const filename = path.basename(img).toLowerCase();
      // Matches: key.ext, key_*.ext, or containing _key
      return (
        filename.startsWith(`${key}.`) || 
        filename.startsWith(`${key}_`) || 
        filename.startsWith(`${key}-`) ||
        filename.includes(`_${key}`)
      );
    });

    if (item.images !== undefined) {
      // It's a product (or has an images array)
      const currentImages = item.images || [];
      const dynamicImages = matched.map(url => ({ url }));
      
      // If we found dynamic images in the folder, use them. Otherwise, fall back to hardcoded image or fallback placeholder
      const finalImages = dynamicImages.length > 0 
        ? dynamicImages 
        : (currentImages.length > 0 ? currentImages : [{ url: fallbackImage }]);
      
      return {
        ...item,
        images: finalImages
      };
    } else {
      // It's a gallery item or slider item that has a single 'url' or 'imageUrl'
      const finalUrl = matched.length > 0 
        ? matched[0] 
        : (item.url || (item as any).imageUrl || fallbackImage);
      
      if ('imageUrl' in item) {
        return {
          ...item,
          imageUrl: finalUrl
        };
      } else {
        return {
          ...item,
          url: finalUrl
        };
      }
    }
  });
}
