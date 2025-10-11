import { useState, useEffect} from "react"
import type { FormEvent } from "react"
import { BsSearch } from "react-icons/bs"
import { Link, useNavigate } from "react-router"
import styles from './home.module.css'

export interface CoinsProps {
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    vwap24Hr: string;
    changePercent24Hr: string;
    rank: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    explorer: string;
    formatedPrice?: string;
    formatedMarket?: string;
    formatedVolume?: string;

}

interface DataProp {
    data: CoinsProps[];
}

export function Home() {
    const [input, setInput] = useState("")
    const [coins, setCoins] = useState<CoinsProps[]>([])
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, [offset])

    async function getData() {
        fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=5a025982b177096203243056c4b45bdf5e64b72043871578eb11c0156b5ed3e2`)
            .then(response => response.json())
            .then((data: DataProp) => {
                const coinsData = data.data;
                console.log(coinsData)

                const price = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",

                })
                const priceCompact = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    notation: "compact"
                })

                const coinsFormated = coinsData.map((item) => {
                    const formated = {
                        ...item,
                        formatedPrice: price.format(Number(item.priceUsd)),
                        formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
                        formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
                    }
                    return formated
                })
                const listcoins = [...coins, ...coinsFormated]
                setCoins(listcoins)
            })
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault
        if (input === "") return
        navigate(`/detail/${input}`)
    }

    function handleMore() {
        if(offset === 0){
        setOffset(10)
        }
      setOffset(offset + 10)
      
        
    }

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input placeholder="Insira o nome da moeda"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button type="submit" >
                    <BsSearch size={30} color="#FFF" />
                </button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Moeda</th>
                        <th scope="col">Valor Mercado</th>
                        <th scope="col">Preço</th>
                        <th scope="col">Volume</th>
                        <th scope="col">Mudança 24h</th>
                    </tr>
                </thead>

                <tbody id="tbody">
                    {coins.length > 0 && coins.map((item) => (
                        <tr className={styles.tr}>
                            <td className={styles.tdLabel} data-label="Moeda">
                                <div className={styles.name}>
                                    <img className={styles.logo} src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}2@2x.png`} alt="icone" />
                                    <Link to={`/detail/${item.id}`} ><span>{item.name}</span> | {item.symbol} </Link>
                                </div>
                            </td>
                            <td className={styles.tdLabel} data-label="Valor Mercado">
                            {item.formatedMarket}
                            </td>
                            <td className={styles.tdLabel} data-label="Preço">
                                {item.formatedPrice}
                            </td>
                            <td className={styles.tdLabel} data-label="Volume">
                                {item.formatedVolume}
                            </td>
                            <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
                                <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            <button className={styles.buttonmore} onClick={handleMore}> Carregar mais</button>
        </main>
    )
}