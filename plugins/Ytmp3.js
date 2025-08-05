const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

module.exports = {
  name: "ytmp3",
  command: ["ytmp3"],
  async run(message, args) {
    if (!args || args.length === 0) {
      return message.reply("❌ Provide a YouTube search term or link.");
    }

    const query = args.join(" ");

    try {
      const result = await ytSearch(query);
      const video = result.videos[0];
      if (!video) return message.reply("❌ No video found.");

      const stream = ytdl(video.url, { filter: "audioonly" });

      await message.sendMessage({ stream }, "audio", {
        mimetype: "audio/mp4",
        ptt: false,
      });
    } catch (err) {
      console.error("ytmp3 plugin error:", err);
      message.reply("❌ Plugin error: " + err.message);
    }
  },
};
