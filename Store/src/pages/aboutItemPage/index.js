import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
    const [comment, setComment] = useState('');
    const [mark, setMark] = useState(0);
    
    useEffect( () => {
        const getComment = async() => {
            try {
                const response = await axios.post('http://localhost:3002/getComments', {id: item.id, category: item.category})
                if(response.data.length !== 0) {
                    console.log(response.data);
                    setItemComments(response.data)
                }
            } catch(err) {
    
            }
        }
        getComment();
        return () => dispatch({type:"DELETE_ITEM"})
    }, [dispatch, item.id, item.category])

    return <div className = "about-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "shadow-image" style = {showImage ? {visibility: 'visible'} : {visibility: 'hidden'}} onClick = {() => {
                setShowImage(false);
                setImagePath('');
                }}>
            <div className = "image-container">
                <img src = {imagePath} alt={item.title} className = "selected-image" />  
            </div>
        </div>
        <div className = "about-item-container">
            <p className = "about-title">{item.title}</p>
            <div className = "short-info">
                <img src = {item.src} alt = {item.title}/>
                <p className = "price-title">{`Цена: ${item.price} руб`}</p>
                <button className = "basket-btn" onClick = {() => dispatch({type: "ADD_BASKET_ITEM",payload: {...item, count: 1}})}>Отправить в корзину</button>
            </div>
            <p className = "about_information-title">Описание</p>
            <div className = "about_information-container">
                <div className = "about_pictures">
                    {item.picture.map(picture => <img key ={picture} src = {picture} alt = {item.title} onClick = {() => {
                        setShowImage(true);
                        setImagePath(picture);
                        }}/>)}
                </div>
                <div className = "about_information">
                    {item.description.map(characteristic => <div className = "characteristic-container" key = {characteristic.paragraph_title}>
                        <p className = "characteristics-title">{characteristic.paragraph_title}</p>
                        {characteristic.params.map(param => <div className = "characteristics" key = {`${param.title}${param.value}`}>
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
                    <div class="rating-area">
                        <input type="radio" id="star-5" name="rating" value="5" onClick ={() => setMark(5)}/>
                        <label for="star-5" title="Оценка «5»"></label>	
                        <input type="radio" id="star-4" name="rating" value="4" onClick ={() => setMark(4)}/>
                        <label for="star-4" title="Оценка «4»"></label>    
                        <input type="radio" id="star-3" name="rating" value="3" onClick ={() => setMark(3)}/>
                        <label for="star-3" title="Оценка «3»"></label>  
                        <input type="radio" id="star-2" name="rating" value="2" onClick ={() => setMark(2)}/>
                        <label for="star-2" title="Оценка «2»"></label>    
                        <input type="radio" id="star-1" name="rating" value="1" onClick ={() => setMark(1)}/>
                        <label for="star-1" title="Оценка «1»"></label>
                    </div>
                    <textarea rows = "6"  placeholder = "Ваш комментарий..." className = "user-comment" value ={comment} onChange = {(event) => setComment(event.target.value)}/>
                    <button className = "send-comment-btn" onClick = { async () => {
                        const date = new Date();
                        const sendData = {
                            product_id: item.id,
                            marks: mark,
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
                        const hueta = document.getElementsByName('rating');
                        for(let i = 0; i< hueta.length; i++) {
                            hueta[i].checked = false;
                        }
                    }}>Оставить комментарий</button>
                </div>}
                {itemComments && itemComments.map((item,index) => <div key = {`${index}${item.nickname}`} className = "comment-item_container">
                        
                        <div class="rating-mini">
                            {Array.from({length: item.marks}).map((item,index) => <span className = "active"></span>)}  
                            {Array.from({length: 5 - item.marks}).map((item,index) => <span></span>) }
                        </div>
                        <div className = "comment-header"> 
                            <p className = "comment-date">{item.date}</p>
                            <p className = "comment-nickname">{item.user_nickname}</p>
                        </div>
                        <p className = "comment-text">{`Комментарий: ${item.comment_text}`}</p>
                </div>)}
                {!itemComments && <div className = "no-comments">
                    <p>Отзывы отсутствуют :(</p>
                </div>}
            </div>
        </div>
    </div>
}