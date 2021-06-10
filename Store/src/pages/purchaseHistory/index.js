import './style.css'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { NotFound } from '../../components/notFound';
import { takeDataSuccess, takeDataFailure} from '../../actionCreators';

export const PurchaseHistory = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.authUser);
    const dataError = useSelector(state => state.serverError);
    const [emptyHistory, setEmptyHistory] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try{
                const response = await axios.post('http://localhost:3002/history',user)
                setData(response.data);
                if(response.data.length ===0)
                 setEmptyHistory(true);
                dispatch(takeDataSuccess());
            } catch (err) {
                dispatch(takeDataFailure());
            }
        }
        getData();
    },[dispatch, user])    

    return <div className = "history-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "history-container">
            {!dataError && data && data.map(historyItem => <div key = {historyItem.id}className = "history_item-container">
                <p className = "hystory_date">{`Дата покупки: ${historyItem.date}`}</p>
                {historyItem.products.map((item, index) => <div key = {`${item.title}`} className = "history_item">
                    <p className = "history_item-number">{index + 1}</p>
                    <div style = {{ width: '150px', height: '150px'}}>
                        <img src = {item.src} alt = {item.title} />
                    </div>
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
            {emptyHistory && <p className = "history_item-title">История пуста</p>}
        </div>
    </div>
}