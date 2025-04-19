import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const metadata = await extractMetadataFromPage(page);
    await browser.close();
    return NextResponse.json({ url, metadata });
  } catch (error) {
    console.error('Error during scraping:', error);
    return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
  }
}

async function extractMetadataFromPage(page) {
  return await page.evaluate(() => {
    const getMeta = (name) =>
      document.querySelector(`meta[name="${name}"]`)?.content ||
      document.querySelector(`meta[property="${name}"]`)?.content ||
      null;
    const origin = location.origin;
    const pageTitle = document.title || null;
    const description = getMeta('description')
    const bodyText = document.body.innerText || '';
    const wordCount = bodyText.trim().split(/\s+/).length;
    const h1Tags = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim()).filter(Boolean);

const getHeadings = (tag) => {
  const nodes = Array.from(document.querySelectorAll(tag));
  const texts = nodes.map(h => h.innerText.trim()).filter(Boolean);
  return { texts, count: texts.length };
};

const headingsData = {
  h2: getHeadings('h2').texts,
  h2_numbers: getHeadings('h2').count,

  h3: getHeadings('h3').texts,
  h3_numbers: getHeadings('h3').count,

  h4: getHeadings('h4').texts,
  h4_numbers: getHeadings('h4').count,

  h5: getHeadings('h5').texts,
  h5_numbers: getHeadings('h5').count,

  h6: getHeadings('h6').texts,
  h6_numbers: getHeadings('h6').count,
};

    const links = Array.from(
      new Set(
        Array.from(document.querySelectorAll('a'))
          .map((anchor) => anchor.href)
          .filter((href) => href && href.trim() !== '')
      )
    );
    const internalLinks = links.filter(
      (link) => link.startsWith(origin) || link.startsWith('/')
    );
    const externalLinks = links.filter(
      (link) => !link.startsWith(origin) && !link.startsWith('/')
    );
    const canonical = document.querySelector('link[rel="canonical"]')?.href || null;
    const hasIFrames = document.querySelectorAll('iframe').length > 0;
    // const bodyText = document.body.innerText;
    const emailMatches = bodyText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/gi);
    const plainTextEmails = emailMatches ? Array.from(new Set(emailMatches)) : [];
    // Optional: if you want nofollow/dofollow analysis
    const anchors = Array.from(document.querySelectorAll('a'));
    const nofollowLinks = Array.from(new Set(
      anchors.filter((a) => a.href && a.rel.includes('nofollow')).map((a) => a.href)
    ));
    const dofollowLinks = Array.from(new Set(
      anchors.filter((a) => a.href && !a.rel.includes('nofollow')).map((a) => a.href)
    ));
    return {
      title: {
        text: pageTitle,
        length: pageTitle ? pageTitle.length : 0,
      },
      description: {
        text: description,
        length: description?.length || 0,
      },
      ogImage: getMeta('og:image'),
      canonical,
      favicon:
      document.querySelector('link[rel="icon"]')?.href ||
      document.querySelector('link[rel="shortcut icon"]')?.href ||
      null,
      hasIFrames,
      plainTextEmails,
      wordCount,
      h1Tags, // ⬅️ Here you get all H1 tags
      headingData: headingsData,
      linkData: {
          internalLinks,
          externalLinks,
          total_links: links.length,
          internal_count: internalLinks.length,
          external_count: externalLinks.length,
          nofollowLinks,
          dofollowLinks,
          nofollow_count: nofollowLinks.length,
          dofollow_count: dofollowLinks.length,
      }
    };
  });
}
