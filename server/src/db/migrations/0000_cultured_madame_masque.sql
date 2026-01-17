-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "tweets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"content" varchar(200) NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"subscriberId" uuid NOT NULL,
	"channelId" uuid NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(30) NOT NULL,
	"description" varchar(160),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"videoId" uuid NOT NULL,
	"parentCommentId" uuid,
	"content" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"fullname" varchar(20) NOT NULL,
	"username" varchar(12) NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"avatar" text,
	"coverImage" text,
	"refreshToken" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"videoFile" text NOT NULL,
	"thumbnail" text NOT NULL,
	"title" varchar(60) NOT NULL,
	"description" varchar(160),
	"duration" integer NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"likeCount" integer DEFAULT 0 NOT NULL,
	"commentCount" integer DEFAULT 0 NOT NULL,
	"isPublished" boolean DEFAULT true NOT NULL,
	"publishedAt" timestamp(3),
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_PlaylistToVideo" (
	"A" uuid NOT NULL,
	"B" uuid NOT NULL,
	CONSTRAINT "_PlaylistToVideo_AB_pkey" PRIMARY KEY("A","B")
);
--> statement-breakpoint
CREATE TABLE "video_likes" (
	"userId" uuid NOT NULL,
	"videoId" uuid NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "video_likes_pkey" PRIMARY KEY("userId","videoId")
);
--> statement-breakpoint
CREATE TABLE "tweet_likes" (
	"userId" uuid NOT NULL,
	"tweetId" uuid NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "tweet_likes_pkey" PRIMARY KEY("userId","tweetId")
);
--> statement-breakpoint
ALTER TABLE "tweets" ADD CONSTRAINT "tweets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PlaylistToVideo" ADD CONSTRAINT "_PlaylistToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."playlists"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "_PlaylistToVideo" ADD CONSTRAINT "_PlaylistToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "video_likes" ADD CONSTRAINT "video_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "video_likes" ADD CONSTRAINT "video_likes_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tweet_likes" ADD CONSTRAINT "tweet_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tweet_likes" ADD CONSTRAINT "tweet_likes_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "public"."tweets"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "tweets_userId_idx" ON "tweets" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "subscriptions_channelId_idx" ON "subscriptions" USING btree ("channelId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "subscriptions_subscriberId_channelId_key" ON "subscriptions" USING btree ("subscriberId" uuid_ops,"channelId" uuid_ops);--> statement-breakpoint
CREATE INDEX "subscriptions_subscriberId_idx" ON "subscriptions" USING btree ("subscriberId" uuid_ops);--> statement-breakpoint
CREATE INDEX "UserPlaylist" ON "playlists" USING btree ("userId" text_ops,"name" text_ops);--> statement-breakpoint
CREATE INDEX "playlists_userId_idx" ON "playlists" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "comments_parentCommentId_idx" ON "comments" USING btree ("parentCommentId" uuid_ops);--> statement-breakpoint
CREATE INDEX "comments_userId_idx" ON "comments" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "comments_videoId_idx" ON "comments" USING btree ("videoId" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "users_refreshToken_key" ON "users" USING btree ("refreshToken" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_key" ON "users" USING btree ("username" text_ops);--> statement-breakpoint
CREATE INDEX "videos_isPublished_publishedAt_idx" ON "videos" USING btree ("isPublished" timestamp_ops,"publishedAt" bool_ops);--> statement-breakpoint
CREATE INDEX "videos_title_idx" ON "videos" USING btree ("title" text_ops);--> statement-breakpoint
CREATE INDEX "videos_userId_idx" ON "videos" USING btree ("userId" uuid_ops);--> statement-breakpoint
CREATE INDEX "_PlaylistToVideo_B_index" ON "_PlaylistToVideo" USING btree ("B" uuid_ops);--> statement-breakpoint
CREATE INDEX "video_likes_videoId_createdAt_idx" ON "video_likes" USING btree ("videoId" timestamp_ops,"createdAt" timestamp_ops);--> statement-breakpoint
CREATE INDEX "tweet_likes_tweetId_idx" ON "tweet_likes" USING btree ("tweetId" uuid_ops);
*/