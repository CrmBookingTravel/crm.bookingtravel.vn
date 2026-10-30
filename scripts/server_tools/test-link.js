async function test() {
  const url = 'https://zalo.me/g/aidyng514';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  console.log('Final URL:', res.url);
  const title = html.match(/<title>(.*?)<\/title>/i);
  console.log('Title:', title ? title[1] : 'No title');
  
  // Find any zalo web links or button texts
  const matches = html.match(/href="([^"]+)"/g);
  console.log('Hrefs:', matches ? matches.slice(0, 10) : 'None');
}

test();
