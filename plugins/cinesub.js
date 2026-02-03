const { cmd, commands } = require('../command');
const axios = require('axios');
const cheerio = require('cheerio');

cmd({
    pattern: "cinesub",
    alias: ["movie", "cs"],
    desc: "Search and get movie links from Cinesubz",
    category: "download", // මෙතන ඔයාගේ menu එකේ තියෙන category එකට සමාන විය යුතුයි
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
        if (!q) return reply("කරුණාකර සොයන්න අවශ්‍ය චිත්‍රපටයේ නම ඇතුළත් කරන්න. (උදා: .cinesub Spiderman)");

        await reply("සොයමින් පවතිනවා... 🔎");

        // Cloudflare Bypass API (ZenRows) - මෙතනට ඔබේ Key එක දාන්න
        const apiKey = '31af59411927f324ccab74feb791ef00a07db92f'; 
        const targetUrl = encodeURIComponent(`https://cinesubz.lk/?s=${q}`);
        const proxyUrl = `https://api.zenrows.com/v1/?key=${apiKey}&url=${targetUrl}&js_render=true&premium_proxy=true`;

        const { data } = await axios.get(proxyUrl);
        const $ = cheerio.load(data);
        let results = "";

        $('.result-item').each((i, el) => {
            const title = $(el).find('.title a').text().trim();
            const link = $(el).find('.title a').attr('href');
            if (title && link) {
                results += `*🎬 ${title}*\n🔗 ${link}\n\n`;
            }
        });

        if (results === "") {
            return reply("කණගාටුයි, එම නමින් චිත්‍රපටයක් හමු වූයේ නැත.");
        }

        let msg = `*--- CINESUBZ SEARCH RESULTS ---*\n\n${results}*Powered by Gemini*`;
        
        await conn.sendMessage(from, { text: msg }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("සර්වර් එකේ දෝෂයක් හෝ Cloudflare බාධාවක්. පසුව උත්සාහ කරන්න.");
    }
});
