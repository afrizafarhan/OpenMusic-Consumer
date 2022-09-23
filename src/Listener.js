class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;
    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { targetEmail, playlistId } = JSON.parse(message.content.toString());
      const playlistSongs = await this._playlistsService.getPlaylistSongsByPlaylistId(playlistId);
      const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify({
        playlist: playlistSongs
      }));
      console.info(result);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Listener;
