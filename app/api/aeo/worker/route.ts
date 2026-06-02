import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateAEOArticle, fetchUnsplashImage } from '@/lib/ai';
import { uploadWPImageFromUrl, createWPPost } from '@/lib/wordpress';

// In a real production setup, we would wrap this with @upstash/qstash Next.js verifySignature middleware.
// For now, we will handle the logic directly.

export async function POST(req: Request) {
  try {
    const { articleId } = await req.json();

    if (!articleId) {
      return NextResponse.json({ error: 'Missing articleId' }, { status: 400 });
    }

    // 1. Fetch the pending article
    const article = await prisma.aeoArticle.findUnique({
      where: { id: articleId },
      include: { site: true } // Get the WP credentials
    });

    if (!article || article.status !== 'PENDING') {
      return NextResponse.json({ error: 'Article not found or not pending' }, { status: 404 });
    }

    // 2. Mark as GENERATING
    await prisma.aeoArticle.update({
      where: { id: articleId },
      data: { status: 'GENERATING' }
    });

    const topic = article.topic;
    const site = article.site;

    // 3. Generate HTML with Claude 3.5 Haiku
    console.log(`[AEO Worker] Generating article for topic: ${topic}`);
    const htmlContent = await generateAEOArticle(topic);

    // 4. Fetch Unsplash Image
    console.log(`[AEO Worker] Fetching featured image for: ${topic}`);
    const imageData = await fetchUnsplashImage(topic);

    let featuredMediaId = null;

    // 5. Upload Image to WordPress
    if (imageData) {
      console.log(`[AEO Worker] Uploading image to WordPress...`);
      const filename = `aeo-${Date.now()}.jpg`;
      featuredMediaId = await uploadWPImageFromUrl(
        { url: site.url, appUser: site.appUser, appToken: site.appToken },
        imageData.url,
        filename
      );
      
      // Optionally append image credit to the end of the article
      // htmlContent += `<p style="font-size: 12px; color: #666; margin-top: 40px;"><em>Photo by ${imageData.author} on Unsplash</em></p>`;
    }

    // 6. Create WordPress Post
    console.log(`[AEO Worker] Creating WordPress post...`);
    const wpPostId = await createWPPost(
      { url: site.url, appUser: site.appUser, appToken: site.appToken },
      topic, // Using topic as title
      htmlContent,
      featuredMediaId
    );

    if (!wpPostId) {
      throw new Error('Failed to create WordPress post');
    }

    // 7. Update DB to PUBLISHED
    await prisma.aeoArticle.update({
      where: { id: articleId },
      data: { 
        status: 'PUBLISHED',
        wpPostId,
        scheduledFor: new Date() // Set to now to indicate published time
      }
    });

    console.log(`[AEO Worker] Successfully published article ${articleId} to WordPress post ${wpPostId}`);

    return NextResponse.json({ success: true, wpPostId });
  } catch (error: any) {
    console.error('[AEO Worker] Error:', error);
    
    // Optionally try to mark it as FAILED if we know the articleId
    // await prisma.aeoArticle.update({ where: { id: articleId }, data: { status: 'FAILED' } });

    return NextResponse.json({ error: 'Worker processing failed', details: error.message }, { status: 500 });
  }
}
