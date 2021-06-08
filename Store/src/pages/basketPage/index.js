import './style.css'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react';
import axios from 'axios';

export const BasketPage = () => {

    const dispatch = useDispatch();

    const signIn = useSelector(state => state.signIn);
    const basket = useSelector(state => state.basket);
    const user = useSelector(state => state.authUser);
    const [delivery, setDelivery] = useState(false);
    const [adress, setAdress] = useState('');

    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(()  => {
        const price = basket.reduce((total,item) => total = total + item.price * item.count, 0); 
        setTotalPrice(price);
    }, [basket])

    const sendData = async () => {
        const date = new Date();
        const { id } = user;
        const basketData = {
            id,
            products: basket,
            date: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,
            total_price: totalPrice,
            delivery,
            adress_delivery: adress
        }
        if(basket.length !== 0) {
            await axios.post('http://localhost:3002/buyItem',basketData);
            dispatch({type: "CLEAR_BASKET"});
            alert('Покупка совершена');
        } else {
            alert('Вы ничего не положили в корзину')
        }
    }

    const sendOffer = () => {
        if(signIn) {
            sendData();
        } else {
            alert('Войдите в систему')
        }
    }

    return <div className = "basket-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "basket-contaoner">
            {basket && basket.map((item,index) => <div className = "item-container">
                {console.log(item)}
                <div className = "basket-item">
                    <p className ="item-number">{index+1}</p>
                    <img src = {item.src} alt = {item.title} style = {{width: '130px'}}/>
                    <div className = "item-short-info">
                        <p className = "item-title">{item.title}</p>
                        <p className = "item-code">{`Код: ${item.code}`}</p>
                    </div>
                    <div className = "item-counter-container">
                        <p>Количество:</p>
                        <div className = "item-counter">
                            <button className = "counter-btn" onClick = {() => dispatch({type: "DELETE_ITEM_COUNT", payload: index})}>-</button>
                            <p className = "counter-value">{item.count}</p>
                            <button className = "counter-btn" onClick = {() => dispatch({type: "ADD_ITEM_COUNT", payload: index})}>+</button>
                        </div>
                    </div>
                    <div>
                        <p className = "item-price">{`${item.price} руб`}</p>
                        <p className = "item-label">наличие:</p>
                    </div>
                    <div>
                        <button className = "delete-btn" onClick = {() => dispatch({type: "DELETE_BASKET_ITEM", payload: index})}/>
                        <p className = "label">В наличии</p>
                    </div>
                </div>
            </div>)}
            {basket.length !== 0 && <div className = "basket_delivery-container">
                <div className = "basket_delivery_checkbox">
                    <input type = "checkbox" onChange = {() => setDelivery(!delivery)}/>
                    <p className = "basket_price-title">Нужна ли доставка?</p>
                </div>
                {delivery && <p className = "basket_price-title">Введите адрес доставки:</p>}
                {delivery && <input type = "text" onChange = {(event) => setAdress(event.target.value)} className = "adress-field"/>}
            </div>}
            {basket.length === 0 && <p className = "basket_price-title">Корзина пуста</p>}
            <p className = "basket_price-title">{`Итого: ${totalPrice} руб`}</p>
            <button className = "offer-btn" onClick = {sendOffer}>Оформить заказ</button>
        </div>
    </div>
}