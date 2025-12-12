import { videos } from "@/components/data";

export default function HomePage() {
  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 p-4">
        {videos
          .filter((video) => video.isPublished)
          .map((video) => (
            <div key={video.id} className="w-full bg-card">
              <div className="relative mb-2 w-full pt-[56%]">
                <div className="absolute inset-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full"
                  />
                </div>
                <span className="absolute bottom-1 right-1 inline-block rounded bg- px-1.5 text-sm">
                  {video.duration}
                </span>
              </div>
              <div className="flex gap-x-2">
                <div className="h-10 w-10 shrink-0">
                  <img
                    src={video.owner.avatar}
                    alt={video.owner.username}
                    className="h-full w-full rounded-full"
                  />
                </div>
                <div className="w-full">
                  <h6 className="mb-1 font-semibold">{video.title}</h6>
                  <p className="flex text-sm text-secondary-foreground">
                    {video.views}&nbsp;Views &middot; {video.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {video.owner.fullName}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
