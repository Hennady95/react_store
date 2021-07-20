import { Link } from 'react-router-dom'
import './style.css'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const FindItems = ({show}) => {

    const dispatch = useDispatch();
    const findTitle = useSelector(state => state.findItemTitle);
    const [findData, setFindData] = useState(null);
    const [lostServerConnection,setLostServerConnection] = useState(false);

    useEffect( () => {
        const getData = async () => {
            try {
                const response = await axios.get('http://localhost:3002/products');
                const regExp = new RegExp(findTitle.toLowerCase());
                const newData = response.data.reduce((data,item) => {
                    if(regExp.test(item.title.toLowerCase())) {
                        data.push(item);
                    }
                    return data
                }, []);
                setFindData(newData);
                setLostServerConnection(false);
            } catch (err) {
                setLostServerConnection(true);
            }
        }
        getData();
    }, [findTitle])

    const closeFindItem = useCallback(() => {
        setFindData(null);
        show(false);
        dispatch({ type: 'DELETE_FIND_TITLE'});
    }, [dispatch, show] );

    const showFindItems = useCallback( (item) => {
        show(false);
        dispatch({ type: "SELECT_ITEM", payload: item})
        }, [dispatch, show])

    return <div className = "find-shadow" onClick = {closeFindItem}>
        <div className = "find_result-container"  onClick = {(event) => event.stopPropagation()}>
            {findData && findData.map((item, index) => <div className = "find-item-container" key = {`${index}-${item.tiltle}`}>
                    <img src = {item.src} alt = {`${item.title}`}/> 
                    <div>
                        <Link className = "fint_item-title" to = {`/catalog/${item.category}/${item.title}`} onClick = {() => showFindItems(item)}>{item.title}</Link>
                        <p className = "find_item-code">{`Код товара: ${item.code}`}</p>
                    </div>
                    <div>
                        <p className = "find_price-title">{`${item.price} руб`}</p>
                        <button className = "find_buy-btn" onClick = {() => dispatch({ type: "ADD_BASKET_ITEM", payload: {...item, count: 1}})}>В корзину</button>
                    </div>
            </div>)}
            {lostServerConnection && <p>Сервер не доступен</p>}
        </div>
    </div>
}