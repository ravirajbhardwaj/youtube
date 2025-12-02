import { Hono } from 'hono'

import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from './video.controller'

const videoRouter = new Hono()
// videoRouter.use(verifyJWT)

videoRouter.get('/', getAllVideos).post(
  // upload.fields([
  //   {
  //     name: "videoFile",
  //     maxCount: 1,
  //   },
  //   {
  //     name: "thumbnail",
  //     maxCount: 1,
  //   },

  // ]),
  publishAVideo
)

videoRouter
  .get('/:videoId', getVideoById)
  .delete(deleteVideo)
  .patch(/* upload.single("thumbnail"),*/ updateVideo)

videoRouter.patch('/toggle/publish/:videoId', togglePublishStatus)

export default videoRouter
