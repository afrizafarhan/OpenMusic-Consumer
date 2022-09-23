const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongsByPlaylistId(playlistId) {
    const queryPlaylist = {
      text: 'SELECT p.id, p.name FROM playlists p WHERE p.id = $1',
      values: [playlistId],
    };
    const playlistResult = await this._pool.query(queryPlaylist);

    if (!playlistResult.rowCount) {
      throw new Error('Playlist tidak ditemukan');
    }

    const playlist = playlistResult.rows[0];

    const text = `SELECT ps.song_id as id, s.title, s.performer
      FROM playlist_songs ps 
      INNER JOIN songs s ON ps.song_id = s.id WHERE ps.playlist_id = $1`;

    const querySongs = {
      text,
      values: [playlist.id],
    };
    const songs = await this._pool.query(querySongs);
    playlist.songs = songs.rows;
    return playlist;
  }
}

module.exports = PlaylistsService;
