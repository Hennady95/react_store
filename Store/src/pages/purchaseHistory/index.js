import './style.css'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { NotFound } from '../../components/notFound'

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

    const dispatch = useDispatch();
    const user = useSelector(state => state.authUser);
    const dataError = useSelector(state => state.serverError);

    const [data, setData] = useState(null);

    useEffect(async () => {
        try{
            const response = await axios.post('http://localhost:3002/history',user)
            setData(response.data);
            dispatch({type: "TAKE_DATA_SUCCESS"});
        } catch (err) {
            dispatch({type: "TAKE_DATA_FAILURE"});
        }
    },[])    

    return <div className = "history-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "history-container">
            {!dataError && data && data.map(historyItem => <div key = {historyItem.id}className = "history_item-container">
                <p className = "hystory_date">{`Дата покупки: ${historyItem.date}`}</p>
                {historyItem.products.map((item, index) => <div key = {`${item.title}`} className = "history_item">
                    <p className = "history_item-number">{index + 1}</p>
                    <img src = {item.src} alt = {item.title} style = {{ maxWidth: '150px', maxHeight: '150px'}}/>
                    <div className = "history_item-info">
                        <p className = "history_item-title">{item.title}</p>
                        <p className = "history_item-code">{`Код товара: ${item.code}`}</p>
                    </div>
                    <p className = "history_item-count">{`Количество: ${item.count}`}</p>
                    <p className = "history_item-price">{`Цена за ед. товара: ${item.price} руб`}</p>
                </div>)}
                <p className = "history_item_totalprice">{`Итого: ${historyItem.total_price} руб`}</p>
            </div>)}
            {dataError && <NotFound />}
        </div>
    </div>
}