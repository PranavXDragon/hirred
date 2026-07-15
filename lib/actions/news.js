"use server";



export async function getLiveNews(keyword) {
  try {
    // Construct Google News RSS URL
    const query = encodeURIComponent(`"${keyword}" industry OR business`);
    const response = await fetch(`https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) throw new Error('Failed to fetch RSS');
    const xml = await response.text();
    
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    // Extract top 4 items
    while ((match = itemRegex.exec(xml)) !== null && items.length < 4) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      
      items.push({
        title: titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : 'News Article',
        link: linkMatch ? linkMatch[1] : '#',
        pubDate: pubDateMatch ? pubDateMatch[1] : new Date().toISOString()
      });
    }
    
    const articles = items.map(item => {
      // Extract publisher from title (usually in the format "Article Title - Publisher")
      const titleParts = item.title ? item.title.split(' - ') : ['News Article'];
      const author = titleParts.length > 1 ? titleParts.pop() : 'News Source';
      const cleanTitle = titleParts.join(' - ');
      
      let cleanDesc = "Click to read the latest intelligence on this topic.";
      let imageUrl = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600";
      
      return {
        tag: "Live Update",
        title: cleanTitle,
        author: author,
        date: new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        desc: cleanDesc,
        image: imageUrl,
        link: item.link
      };
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching live news:', error);
    return [];
  }
}
