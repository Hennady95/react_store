import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NotFound } from '../../components/notFound'
import axios from 'axios'
import './style.css'

export const AboutPage = () => {

    const dispatch = useDispatch();

    const item = useSelector(state => state.currentItem);
    const singIn = useSelector(state => state.signIn);
    const authUser = useSelector(state => state.authUser);

    const [showImage, setShowImage] = useState(false);
    const [imagePath, setImagePath] = useState('');

    const [itemComments, setItemComments] = useState(null);
    const [comment, setComment] = useState(null);

    useEffect( async () => {
        const response = await axios.post('http://localhost:3002/getComments', {id: item.id, category: item.category})
        if(response.data.length !== 0) {
            console.log(response.data);
            setItemComments(response.data)
        }
        return () => dispatch({type:"DELETE_ITEM"})
    }, [dispatch])

    return <div className = "about-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "shadow-image" style = {showImage ? {visibility: 'visible'} : {visibility: 'hidden'}} onClick = {() => {
                setShowImage(false);
                setImagePath('');
                }}>
            <div className = "image-container">
                <img src = {imagePath} className = "selected-image" />  
            </div>
        </div>
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
                    {item.picture.map(picture => <img src = {picture} onClick = {() => {
                        setShowImage(true);
                        setImagePath(picture);
                        }}/>)}
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
            <div className = "comments-container">
                <p className = "comments-title">Отзывы о {item.title}</p>
                {singIn && <div className = "user-comment_container">
                    <p className = "user-comment_title">Оставить отзыв</p>
                    <textarea rows = "6"  placeholder = "Ваш комментарий..." className = "user-comment" value ={comment} onChange = {(event) => setComment(event.target.value)}/>
                    <button className = "send-comment-btn" onClick = { async () => {
                        const date = new Date();
                        const sendData = {
                            product_id: item.id,
                            product_category: item.category,
                            user_nickname: `${authUser.name} ${authUser.surname}`,
                            comment_text: comment,
                            date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}| ${date.getHours()}:${date.getMinutes()}`
                        } 
                        await axios.post('http://localhost:3002/sendComment', sendData);
                        if(itemComments)
                            setItemComments([sendData,...itemComments])
                        else {
                            setItemComments([sendData])
                        }
                        setComment('');
                    }}>Оставить комментарий</button>
                </div>}
                {itemComments && itemComments.map((item,index) => <div key = {`${index}${item.nickname}`} className = "comment-item_container">
                        <div className = "comment-header"> 
                            <p className = "comment-date">{item.date}</p>
                            <p className = "comment-nickname">{item.user_nickname}</p>
                        </div>
                        <p className = "comment-text">{item.comment_text}</p>
                </div>)}
                {!itemComments && <div className = "no-comments">
                    <p>Отзывы отсутствуют :(</p>
                </div>}
            </div>
        </div>
    </div>
}