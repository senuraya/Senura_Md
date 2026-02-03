const axios = require('axios');
const cheerio = require('cheerio');

async function getCinesubData(query) {
    const apiKey = '31af59411927f324ccab74feb791ef00a07db92f'; // ZenRows වැනි තැනකින් ගන්නා Key එක
    const targetUrl = encodeURIComponent(`https://cinesubz.lk/?s=${query}`);
    const proxyUrl = `https://api.zenrows.com/v1/?key=${apiKey}&url=${targetUrl}&js_render=true&premium_proxy=true`;

    try {
        const { data } = await axios.get(proxyUrl);
        const $ = cheerio.load(data);
        let results = [];

        // Cinesubz සයිට් එකේ HTML structure එක අනුව මෙතන වෙනස් විය යුතුයි
        $('.result-item').each((i, el) => {
            const title = $(el).find('.title a').text();
            const link = $(el).find('.title a').attr('href');
            results.push({ title, link });
        });

        return results;
    } catch (error) {
        console.error("Cloudflare Bypass Error:", error.message);
        return null;
    }
}
