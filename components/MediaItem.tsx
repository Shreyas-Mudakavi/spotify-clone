"use client";

import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import Image from "next/image";

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const imagePath = useLoadImage(data);
  const player = usePlayer();

  const handleClick = async () => {
    if (onClick) {
      return onClick(data?.id);
    }

    // TODO: default turn on player
    return player.setId(data.id);
  };

  return (
    <div
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 transition w-full p-2 rounded-md"
      onClick={handleClick}
    >
      <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
        <Image
          fill
          src={imagePath || "/images/liked.png"}
          className="object-cover"
          alt="Image"
        />
      </div>
      <div className="flex flex-col overflow-hidden gap-y-1">
        <p className="text-white truncate">{data?.title}</p>
        <p className="text-neutral-400 text-sm truncate">{data?.author}</p>
      </div>
    </div>
  );
};

export default MediaItem;
