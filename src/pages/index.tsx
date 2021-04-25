import {GetStaticProps} from 'next'
import { api } from '../services/api'
import Image from 'next/image'
import { format , parseISO} from 'date-fns'
import Head  from 'next/head'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import Link from 'next/link'

import styles from './home.module.scss'
import { PlayerContext, usePlayer } from '../components/contexts/PlayerContext'


type Episode = {
    id: string;
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    durationAsString: string;
    publishedAt: string;
    url: string;

}

type HomeProps ={
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
}

export default function Home({latestEpisodes , allEpisodes }:HomeProps) {
  const {playList} = usePlayer()

  const episodeList = [...latestEpisodes , ...allEpisodes]

  return (
    <div className={styles.homepage}>

      <Head>
        <title>Home | Podcastr</title>

      </Head>
    <section className={styles.latestEpisodes}>
      <h2>Ultimos lancamentos </h2>

      <ul>
        {latestEpisodes.map((episode , index) => {
          return(
            <li key={episode.id}>
              <Image 
              width={192} 
              height={192} 
              src={episode.thumbnail} 
              alt={episode.title}
              objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episode/${episode.id}`}>
                   <a >{episode.title}</a>
                </Link>
                
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>

              </div>

              <button type="button" onClick={() => playList(episodeList , index)}>
                <img src="/play-green.svg" alt="Tocar Episodio"/>
              </button>

            </li>
          )
        })}
      </ul>
    </section>

    <section className={styles.allEpisodes}>
          <h2>Todos os Episodios </h2>
    
     <table cellSpacing={0}> 
          <thead>
            <tr>
              <th></th>
              <th>PodCast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duracao</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode , index )=>{
              return(
                <tr key={episode.id}>
                  <td>
                    <Image 
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                  <Link href={`/episode/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList , index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar Episodio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
      </table>
    </section>
    </div>
   )
}


export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get('episodes', {
      params: {
        _limit: 12 ,
        _sort: 'published_at',
        _order: 'desc'
      }
    })

   
    
    const episodes = data.map(episode => {
        return {
          id: episode.id,
          title: episode.title,
          thumbnail: episode.thumbnail,  
          members: episode.members,
          publishedAt: format( parseISO( episode.published_at), 'd MMM yy' , {locale: ptBR}),
          duration: Number(episode.file.duration),
          durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
          url: episode.file.url,
         
        }
    })

    const latestEpisodes = episodes.slice(0 , 2)
    const  allEpisodes = episodes.slice(2 , episodes.length)

  return{
    props:{
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
  
}