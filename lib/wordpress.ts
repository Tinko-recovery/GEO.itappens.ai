import { decrypt } from '@/lib/encryption';

interface WPSiteCredentials {
  url: string;
  appUser: string;
  appToken: string; // Encrypted
}

/**
 * Helper to generate Basic Auth header.
 */
function getAuthHeader(appUser: string, appTokenEncrypted: string) {
  const token = decrypt(appTokenEncrypted);
  const credentials = Buffer.from(`${appUser}:${token}`).toString('base64');
  return `Basic ${credentials}`;
}

/**
 * Helper to upload an image from a URL to WordPress Media Library.
 * Returns the Media ID.
 */
export async function uploadWPImageFromUrl(credentials: WPSiteCredentials, imageUrl: string, filename: string): Promise<number | null> {
  try {
    // 1. Fetch image from URL
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error('Failed to fetch image from source');
    const imageBuffer = await imageRes.arrayBuffer();
    
    // 2. Upload to WP
    const wpUrl = `https://${credentials.url}/wp-json/wp/v2/media`;
    const uploadRes = await fetch(wpUrl, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(credentials.appUser, credentials.appToken),
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': imageRes.headers.get('content-type') || 'image/jpeg',
      },
      body: imageBuffer
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error('WP Media Upload Error:', err);
      return null;
    }

    const data = await uploadRes.json();
    return data.id;
  } catch (error) {
    console.error('Upload Image Error:', error);
    return null;
  }
}

/**
 * Creates a new WordPress Post.
 */
export async function createWPPost(
  credentials: WPSiteCredentials, 
  title: string, 
  content: string, 
  featuredMediaId?: number | null
): Promise<number | null> {
  try {
    const wpUrl = `https://${credentials.url}/wp-json/wp/v2/posts`;
    const payload: any = {
      title,
      content,
      status: 'publish', // or 'draft'
    };

    if (featuredMediaId) {
      payload.featured_media = featuredMediaId;
    }

    const res = await fetch(wpUrl, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(credentials.appUser, credentials.appToken),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('WP Post Creation Error:', err);
      return null;
    }

    const data = await res.json();
    return data.id;
  } catch (error) {
    console.error('Create Post Error:', error);
    return null;
  }
}
