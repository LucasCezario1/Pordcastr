
import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string

}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  hasPrevious: boolean;
  isLooping: boolean
  hasNext: boolean;
  isShuffling: boolean
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;
  playPrevious: () => void;
  setPlayingState: (state: boolean) => void;

}


export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)
  const [isLooping, setIsLooping] = useState(false)


  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }


  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setPlayingState(true)
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsShuffling(!isShuffling);
  }



  function toggleShuffle() {
    setIsLooping(!isLooping);
  }


  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }


  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
   

  }

  function clearPlayerState(){
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }


  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      play,
      isPlaying,
      togglePlay,
      setPlayingState,
      playList,
      playPrevious,
      playNext,
      hasNext,
      hasPrevious,
      isLooping,
      toggleLoop,
      toggleShuffle,
      clearPlayerState,
      isShuffling
    }} >
      {children}

    </PlayerContext.Provider>


  )

}

export const usePlayer = () => {
  return useContext(PlayerContext)
}