const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "download",
    alias: ["direct", "dl"],
    desc: "Download files from a direct link without small limits",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("🔗 කරුණාකර සෘජු ලින්ක් එකක් ලබා දෙන්න.");

      const isUrl = /^(https?:\/\/[^\s]+)/i.test(q);
      if (!isUrl) return reply("❌ මෙය වලංගු ලින්ක් එකක් නොවේ.");

      reply("⬇️ ලොකු ෆයිල් එකක් නම් බාගත වීමට මද වෙලාවක් ගතවේවි. කරුණාකර රැඳී සිටින්න...");

      // Headers ලබා ගැනීම
      const response = await axios.head(q);
      const mimeType = response.headers["content-type"];
      const fileSize = response.headers["content-length"];

      // මෙහි 2000 * 1024 * 1024 යනු දළ වශයෙන් 2GB වේ.
      if (fileSize > 2000 * 1024 * 1024) {
        return reply("❌ ගොනුව 2GB ට වඩා වැඩියි. WhatsApp මගින් එවිය නොහැක.");
      }

      const fileName = q.split("/").pop().split("?")[0] || "file_download";

      await bot.sendMessage(
        from,
        {
          document: { url: q }, // මෙහි Direct URL එක දීමෙන් බොට්ගේ RAM එකට ලොකු බලපෑමක් නොවී යැවිය හැක
          mimetype: mimeType,
          fileName: fileName,
          caption: `✅ *Download Complete*\n\n📂 *File:* ${fileName}\n⚖️ *Size:* ${(fileSize / (1024 * 1024)).toFixed(2)} MB`,
        },
        { quoted: mek }
      );

    } catch (e) {
      console.log("DOWNLOAD ERROR:", e);
      reply("❌ බාගත කිරීමේදී දෝෂයක් සිදු විය. සමහරවිට සර්වර් එකෙන් ලොකු ෆයිල් බ්ලොක් කරනවා විය හැක.");
    }
  }
);
