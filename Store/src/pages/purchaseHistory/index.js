import './style.css'
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'

/*
<div className = "history_header-container">
                <p className = "history_header-title">№</p>
                <p className = "history_header-title">Изображение</p>
                <p className = "history_header-title">Описание</p>
                <p className = "history_header-title">Количество</p>
                <p className = "history_header-title">Цена</p>
            </div>
 */

export const PurchaseHistory = () => {

    const user = useSelector(state => state.authUser);

    const [data, setData] = useState(null);

    useEffect(async () => {
        const response = await axios.post('http://localhost:3002/history',user)
        if(response.data) {
            setData(response.data)
        }
    },[])    

    return <div className = "history-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "history-container">
            {data && data.map(historyItem => <div key = {historyItem.id}className = "history_item-container">
                <p className = "hystory_date">{`Дата покупки: ${historyItem.date}`}</p>
                {historyItem.products.map((item, index) => <div key = {`${item.title}`} className = "history_item">
                    <p className = "history_item-number">{index + 1}</p>
                    <img src = {item.src}/>
                    <div className = "history_item-info">
                        <p className = "history_item-title">{item.title}</p>
                        <p className = "history_item-code">{`Код товара: ${item.code}`}</p>
                    </div>
                    <p className = "history_item-count">{`Количество: ${item.count}`}</p>
                    <p className = "history_item-price">{`Цена за ед. товара: ${item.price} руб`}</p>
                </div>)}
                <p className = "history_item_totalprice">{`Итого: ${historyItem.total_price} руб`}</p>
            </div>)}
        </div>
    </div>
}