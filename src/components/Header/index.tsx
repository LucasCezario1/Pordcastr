import format from 'date-fns/format'
import  ptBR from 'date-fns/locale/pt-BR'
import Link from 'next/link';
import styles from './styles.module.scss'

export function Header(){
  const currentDate = format(new Date() , 'EEEEEE , d MMMM ',{
    locale: ptBR,
  })
    return(
      <header className={styles.headerContainer}>

      <Link href={`http://localhost:3000/`}>
           <img src="/logo.svg" alt="PodCastr" />   
        </Link>
        
        <p>O melhor para voce ouvir, sempre 🎧 </p>

        <span>{currentDate}</span>
      </header>
    );
}