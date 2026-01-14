const { cmd } = require("../command");
const axios = require("axios");
const cheerio = require("cheerio");

cmd(
  {
    pattern: "cinesub",
    alias: ["movie", "flic"],
    desc: "Search movies from Cinesub.lk",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("🎬 කරුණාකර චිත්‍රපටයේ නම ලබා දෙන්න. (උදා: .cinesub Avatar)");

      await bot.sendMessage(from, { react: { text: "🔍", key: mek.key } });

      const searchUrl = `https://cinesub.lk/?s=${encodeURIComponent(q)}`;
      const { data } = await axios.get(searchUrl);
      const $ = cheerio.load(data);

      let results = [];

      // වෙබ් අඩවියේ ඇති search results සොයා ගැනීම
      $(".result-item").each((i, el) => {
        const title = $(el).find(".title a").text();
        const link = $(el).find(".title a").attr("href");
        const image = $(el).find(".thumbnail img").attr("src");
        const rating = $(el).find(".rating").text().trim();
        const year = $(el).find(".year").text().trim();

        if (title && link) {
          results.push({ title, link, image, rating, year });
        }
      });

      if (results.length === 0) {
        return reply("❌ කිසිදු ප්‍රතිඵලයක් හමු නොවීය.");
      }

      // මුල්ම ප්‍රතිඵලය පෙන්වීම (පසුව ඔබට ඕනෑම එකක් තෝරාගත හැකි ලෙස සකස් කළ හැක)
      const movie = results[0];
      
      let caption = `🎬 *${movie.title}*\n\n`;
      caption += `📅 *Year:* ${movie.year || "N/A"}\n`;
      caption += `⭐ *Rating:* ${movie.rating || "N/A"}\n`;
      caption += `🔗 *Link:* ${movie.link}\n\n`;
      caption += `💡 *බාගත කිරීමට:* මෙහි ඇති ලින්ක් එකට ගොස් Direct Link එක ලබාගෙන .download command එක භාවිතා කරන්න.`;

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
      reply("❌ දත්ත ලබා ගැනීමේදී දෝෂයක් සිදු විය.");
    }
  }
);
