
const ytdl = require("ytdl-core");
const yts = require("yt-search");

command(
  {
    pattern: "ytmp3",
    fromMe: false,
    desc: "Download YouTube audio without cookies (public videos only)",
    type: "downloader",
  },
  async (message, match, m) => {
    try {
      if (!match) return await message.sendReply("Send a YouTube URL or search query.");

      let videoUrl = match;

      // Validate URL or search YouTube
      if (!ytdl.validateURL(videoUrl)) {
        const search = await yts(match);
        if (!search.videos.length) return await message.sendReply("No results found.");
        videoUrl = search.videos[0].url;
      }

      // Get audio stream without cookies
      const audioStream = ytdl(videoUrl, {
        filter: "audioonly",
        quality: "highestaudio",
      });

      // Send audio as voice note or audio file
      await message.sendMessage(
        { audio: audioStream, mimetype: "audio/mpeg" },
        { quoted: message.data }
      );
    } catch (error) {
      console.error("Error in ytmp3 command:", error);
      await message.sendReply(`❌ Error: ${error.message || error}`);
    }
  }
);

