import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import type { CoinsProps } from "../home";
import styles from './detail.module.css'

interface ResponseData {
    data: CoinsProps
}

interface ErrorData {
    error: string;
}
type DataProps = ResponseData | ErrorData
export function Detail() {
    const { cripto } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<CoinsProps>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getCoin() {
            try {
                fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=5a025982b177096203243056c4b45bdf5e64b72043871578eb11c0156b5ed3e2`)
                    .then(response => response.json())
                    .then((data: DataProps) => {
                        if ("error" in data) {
                            navigate("/")
                            return;
                        }
                        const price = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",

                        })
                        const priceCompact = Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            notation: "compact"
                        })

                        const resultData = {
                            ...data.data,
                            formatedPrice: price.format(Number(data.data.priceUsd)),
                            formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
                            formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr))
                        }
                        setData(resultData)
                        setLoading(false)

                    })
            } catch (error) {
                navigate("/")
            }
        }
        
        getCoin();
    }, [cripto])
    if(loading){
        return(
            <div className={styles.container}>
                <h1 className={styles.center}>Caregando.....</h1>
            </div>
            
        )
    }
    
    return (
        <div className={styles.container}>
            <h1 className={styles.center}> {data?.name}</h1>
            <h1 className={styles.center}>{data?.symbol}</h1>

            <section className={styles.content}>
                <img className={styles.logo} src={`https://assets.coincap.io/assets/icons/${data?.symbol.toLocaleLowerCase()}2@2x.png`} alt="logo" />
                <h1>{data?.name} | {data?.symbol}</h1>

                <p><strong>Preço: </strong>{data?.formatedPrice}</p>

                <a><strong>Mercado: </strong>{data?.formatedMarket}</a>

                <a><strong>Volume: </strong>{data?.formatedVolume}</a>

                <a><strong>Mudança 24h: </strong><span className={Number(data?.changePercent24Hr) > 0 ? styles.profit : styles.loss }>{Number(data?.changePercent24Hr).toFixed(2)}</span></a>

            </section>
 
        </div>
    )
}