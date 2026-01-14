const { cmd } = require("../command");
const axios = require("axios");
const cheerio = require("cheerio");

cmd(
  {
    pattern: "cinesub",
    alias: ["movie", "flic"],
    desc: "Search movies from Cinesub.lk (Updated)",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("🎬 කරුණාකර චිත්‍රපටයේ නම ලබා දෙන්න.");

      await bot.sendMessage(from, { react: { text: "🔍", key: mek.key } });

      const searchUrl = `https://cinesub.lk/?s=${encodeURIComponent(q)}`;
      
      // User-Agent එකක් එක් කිරීම (සමහර වෙලාවට වෙබ් අඩවි Bot කෙනෙක් එනවා කියලා block කරන එක වැළැක්වීමට)
      const { data } = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(data);
      let results = [];

      // අලුත්ම HTML structure එකට අනුව දත්ත ලබා ගැනීම
      $("article").each((i, el) => {
        const title = $(el).find(".title a").text().trim() || $(el).find("h2").text().trim();
        const link = $(el).find("a").attr("href");
        const image = $(el).find("img").attr("src");

        if (title && link) {
          results.push({ title, link, image });
        }
      });

      if (results.length === 0) {
        await bot.sendMessage(from, { react: { text: "❌", key: mek.key } });
        return reply("❌ කිසිදු ප්‍රතිඵලයක් හමු නොවීය. (Check spelling)");
      }

      // පළමු ප්‍රතිඵල 3 පමණක් පෙන්වීමට හෝ පළමු එක පමණක් පෙන්වීමට හැකිය
      const movie = results[0];
      
      let caption = `🎬 *${movie.title}*\n\n`;
      caption += `🔗 *Link:* ${movie.link}\n\n`;
      caption += `💡 *Download:* ඉහත ලින්ක් එකට ගොස් පසුව එන Direct Download Link එක .download ලෙස ලබා දෙන්න.`;

      await bot.sendMessage(
        from,
        {
          image: { url: movie.image },
          caption: caption,
        },
        { quoted: mek }
      );

      await bot.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
      console.log("CINESUB ERROR:", e);
      reply("❌ සර්වර් එක සමඟ සම්බන්ධ වීමේ දෝෂයක්. පසුව උත්සාහ කරන්න.");
    }
  }
);
