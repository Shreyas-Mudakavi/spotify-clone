"use client";

import LikeButton from "@/components/LikeButton";
import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";

interface SearchContentProps {
  songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);

  if (songs?.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full text-neutral-400 pt-4">
        No songs found!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full pt-4">
      {songs?.map((song) => (
        <div className="flex items-center gap-x-4 w-full" key={song?.id}>
          <div className="flex-1">
            <MediaItem
              data={song}
              onClick={(id: string) => {
                onPlay(id);
              }}
            />
          </div>

          {/* add like button here */}
          <LikeButton songId={song?.id} />
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
