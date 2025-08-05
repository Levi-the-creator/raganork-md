const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'ytmusic',
  alias: ['yta', 'ytmp3'],
  category: 'downloader',
  desc: 'Download YouTube audio as MP3',
  use: '<search or URL>',
  async exec(m, { args, command, prefix, conn }) {
    if (!args[0]) return m.reply(`Usage: ${prefix + command} <search term or YouTube URL>`);

    let videoUrl;
    if (ytdl.validateURL(args[0])) {
      videoUrl = args[0];
    } else {
      const search = await yts(args.join(' '));
      if (!search.videos.length) return m.reply('No results found.');
      videoUrl = search.videos[0].url;
    }

    try {
      const info = await ytdl.getInfo(videoUrl);
      const title = info.videoDetails.title.replace(/[\\/:"*?<>|]/g, ''); // sanitize filename
      const tmpPath = path.resolve(__dirname, `../tmp`);
      if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath);
      const filePath = path.resolve(tmpPath, `${title}.mp3`);

      const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
      const writeStream = fs.createWriteStream(filePath);
      audioStream.pipe(writeStream);

      writeStream.on('finish', async () => {
        await conn.sendMessage(m.chat, { audio: fs.readFileSync(filePath), mimetype: 'audio/mp4' }, { quoted: m });
        fs.unlinkSync(filePath);
      });

      writeStream.on('error', e => m.reply('Error writing audio file.'));
    } catch (e) {
      m.reply('❌ Failed to download audio.');
    }
  }
};
