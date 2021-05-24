import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NotFound } from '../../components/notFound'
import './style.css'

export const AboutPage = () => {

    const dispatch = useDispatch();

    const item = useSelector(state => state.currentItem);

    useEffect(() => {
        return () => dispatch({type:"DELETE_ITEM"})
    }, [dispatch])

    return <div className = "about-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "about-item-container">
            <p className = "about-title">{item.title}</p>
            <div className = "short-info">
                <img src = {item.src} />
                <p className = "price-title">{`${item.price} руб`}</p>
                <button className = "basket-btn" onClick = {() => dispatch({type: "ADD_BASKET_ITEM",payload: {...item, count: 1}})}>Отправить в корзину</button>
            </div>
            <p className = "about_information-title">Описание</p>
            <div className = "about_information-container">
                <div className = "about_pictures">
                    {item.picture.map(picture => <img src = {picture}/>)}
                </div>
                <div className = "about_information">
                    {item.description.map(characteristic => <div className = "characteristic-container">
                        <p className = "characteristics-title">{characteristic.paragraph_title}</p>
                        {characteristic.params.map(param => <div className = "characteristics">
                            <p className = "subcharacteristic-title">{param.title}</p>
                            <p className ="subcharacteristic-value">{param.value}</p>
                        </div>)}
                    </div>)}
                </div>
            </div>
        </div>
    </div>
}