import { Hono } from 'hono'

import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from './playlist.controller'

const playlistRouter = new Hono()

// playlistRouter.use(verifyJWT)

playlistRouter.post('/', createPlaylist)

playlistRouter
  .get('/:playlistId', getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist)

playlistRouter.patch('/add/:videoId/:playlistId', addVideoToPlaylist)
playlistRouter.patch('/remove/:videoId/:playlistId', removeVideoFromPlaylist)

playlistRouter.get('/user/:userId', getUserPlaylists)

export default playlistRouter
