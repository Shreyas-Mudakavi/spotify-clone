"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer();
  const { song, isLoading } = useGetSongById(player?.activeId);

  const songUrl = useLoadSongUrl(song!); // there maybe a chance that song is undefined for that we can write like this - song!

  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
      <PlayerContent song={song} songUrl={songUrl} key={songUrl} />
      {/* here we have added the key props even though we are not in an array as whenever it changes it completely destroys the component and re-renders the it as a completely new component. As we are going to use playlist and we want to enable users to skip to the next song */}
    </div>
  );
};

export default Player;
