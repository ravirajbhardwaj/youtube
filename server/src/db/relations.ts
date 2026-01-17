import { relations } from 'drizzle-orm/relations'
import {
  users,
  tweets,
  subscriptions,
  playlists,
  comments,
  videos,
  playlistToVideo,
  videoLikes,
  tweetLikes,
} from './schema'

export const tweetsRelations = relations(tweets, ({ one, many }) => ({
  user: one(users, {
    fields: [tweets.userId],
    references: [users.id],
  }),
  tweetLikes: many(tweetLikes),
}))

export const usersRelations = relations(users, ({ many }) => ({
  tweets: many(tweets),
  subscriptions_subscriberId: many(subscriptions, {
    relationName: 'subscriptions_subscriberId_users_id',
  }),
  subscriptions_channelId: many(subscriptions, {
    relationName: 'subscriptions_channelId_users_id',
  }),
  playlists: many(playlists),
  comments: many(comments),
  videos: many(videos),
  videoLikes: many(videoLikes),
  tweetLikes: many(tweetLikes),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user_subscriberId: one(users, {
    fields: [subscriptions.subscriberId],
    references: [users.id],
    relationName: 'subscriptions_subscriberId_users_id',
  }),
  user_channelId: one(users, {
    fields: [subscriptions.channelId],
    references: [users.id],
    relationName: 'subscriptions_channelId_users_id',
  }),
}))

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
  user: one(users, {
    fields: [playlists.userId],
    references: [users.id],
  }),
  playlistToVideos: many(playlistToVideo),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [comments.videoId],
    references: [videos.id],
  }),
  comment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: 'comments_parentCommentId_comments_id',
  }),
  comments: many(comments, {
    relationName: 'comments_parentCommentId_comments_id',
  }),
}))

export const videosRelations = relations(videos, ({ one, many }) => ({
  comments: many(comments),
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  playlistToVideos: many(playlistToVideo),
  videoLikes: many(videoLikes),
}))

export const playlistToVideoRelations = relations(
  playlistToVideo,
  ({ one }) => ({
    playlist: one(playlists, {
      fields: [playlistToVideo.a],
      references: [playlists.id],
    }),
    video: one(videos, {
      fields: [playlistToVideo.b],
      references: [videos.id],
    }),
  })
)

export const videoLikesRelations = relations(videoLikes, ({ one }) => ({
  user: one(users, {
    fields: [videoLikes.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [videoLikes.videoId],
    references: [videos.id],
  }),
}))

export const tweetLikesRelations = relations(tweetLikes, ({ one }) => ({
  user: one(users, {
    fields: [tweetLikes.userId],
    references: [users.id],
  }),
  tweet: one(tweets, {
    fields: [tweetLikes.tweetId],
    references: [tweets.id],
  }),
}))
