import logoimg from '../../assets/logo.svg'
import { Link } from 'react-router'
import styles from './header.module.css'

export function Header(){
    return(
        <header className={styles.container}>
            <Link to={'/'}>
                <img src={logoimg} alt=""
                className={styles.logo} />
            </Link>
        </header>
       
    )
}