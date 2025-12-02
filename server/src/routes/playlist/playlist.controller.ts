import type { Context } from 'hono'

const createPlaylist = async (c: Context) => {
  // const { name, description } = req.body
  //TODO: create playlist
}

const getUserPlaylists = async (c: Context) => {
  //const { userId } = req.params
  //TODO: get user playlists
}

const getPlaylistById = async (c: Context) => {
  // const { playlistId } = req.params
  //TODO: get playlist by id
}

const addVideoToPlaylist = async (c: Context) => {
  // const { playlistId, videoId } = req.params
}

const removeVideoFromPlaylist = async (c: Context) => {
  // const { playlistId, videoId } = req.params
  // TODO: remove video from playlist
}

const deletePlaylist = async (c: Context) => {
  // const { playlistId } = req.params
  // TODO: delete playlist
}

const updatePlaylist = async (c: Context) => {
  // const { playlistId } = req.params
  // const { name, description } = req.body
  //TODO: update playlist
}

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
}
