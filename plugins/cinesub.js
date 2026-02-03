// Command එක: .movie [නම]
// උදා: .movie Spiderman

const axios = require('axios');
const cheerio = require('cheerio');

async function movieCommand(conn, mek, args) {
    const movieName = args.join(' ');
    if (!movieName) return conn.sendMessage(mek.chat, { text: 'කරුණාකර චිත්‍රපටයේ නම ඇතුළත් කරන්න. (උදා: .movie Spiderman)' });

    await conn.sendMessage(mek.chat, { text: 'සොයමින් පවතිනවා... 🔎' });

    try {
        const apiKey = '31af59411927f324ccab74feb791ef00a07db92f'; // ZenRows එකෙන් ගත්තු key එක මෙතනට දාන්න
        const targetUrl = encodeURIComponent(`https://cinesubz.lk/?s=${movieName}`);
        const proxyUrl = `https://api.zenrows.com/v1/?key=${apiKey}&url=${targetUrl}&js_render=true&premium_proxy=true`;

        const { data } = await axios.get(proxyUrl);
        const $ = cheerio.load(data);
        let results = "";

        // Cinesubz සර්ච් රිසල්ට් වල තියෙන Items ලූප් එකක් මගින් ලබා ගැනීම
        $('.result-item').each((i, el) => {
            const title = $(el).find('.title a').text();
            const link = $(el).find('.title a').attr('href');
            if (title && link) {
                results += `*🎬 ${title}*\n🔗 ${link}\n\n`;
            }
        });

        if (results === "") {
            return conn.sendMessage(mek.chat, { text: 'කණගාටුයි, ඔබ සොයන චිත්‍රපටය හමු වූයේ නැත.' });
        }

        const msg = `*--- CINESUBZ SEARCH RESULTS ---*\n\n${results}\n*Powered by Gemini AI*`;
        await conn.sendMessage(mek.chat, { text: msg });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(mek.chat, { text: 'දෝෂයක් සිදු වුණා. පසුව උත්සාහ කරන්න.' });
    }
}
