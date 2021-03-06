import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { deleteCurrentItem, addBasketItem } from '../../actionCreators';
import './style.css';

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
        return () => dispatch(deleteCurrentItem())
    }, [dispatch, item.id, item.category])

    const showPicture = useCallback( (picture) => {
            setShowImage(true);
            setImagePath(picture);
    } , [] )

    const unShowPicture = useCallback( () => {
        setShowImage(false);
        setImagePath('');
} , [] )

    const sendComment = useCallback( async () => {
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
        const raiting = document.getElementsByName('rating');
        for(let i = 0; i < raiting.length; i++) {
            raiting[i].checked = false;
        }
    }, [item, authUser,comment, itemComments, mark])

    return <div className = "about-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "shadow-image" style = {showImage ? {visibility: 'visible'} : {visibility: 'hidden'}} onClick = {unShowPicture}>
            <div className = "image-container">
                <img src = {imagePath} alt={item.title} className = "selected-image" />  
            </div>
        </div>
        <div className = "about-item-container">
            <p className = "about-title">{item.title}</p>
            <div className = "short-info">
                <img src = {item.src} alt = {item.title}/>
                <p className = "price-title">{`????????: ${item.price} ??????`}</p>
                <button className = "basket-btn" onClick = {() => dispatch(addBasketItem({...item, count: 1}))}>?????????????????? ?? ??????????????</button>
            </div>
            <p className = "about_information-title">????????????????</p>
            <div className = "about_information-container">
                <div className = "about_pictures">
                    {item.picture.map(picture => <img key ={picture} src = {picture} alt = {item.title} onClick = {() => showPicture(picture)}/>)}
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
                <p className = "comments-title">???????????? ?? {item.title}</p>
                {singIn && <div className = "user-comment_container">
                    <p className = "user-comment_title">???????????????? ??????????</p>
                    <div class="rating-area">
                        <input type="radio" id="star-5" name="rating" value="5" onClick ={() => setMark(5)}/>
                        <label for="star-5" title="???????????? ??5??"></label>	
                        <input type="radio" id="star-4" name="rating" value="4" onClick ={() => setMark(4)}/>
                        <label for="star-4" title="???????????? ??4??"></label>    
                        <input type="radio" id="star-3" name="rating" value="3" onClick ={() => setMark(3)}/>
                        <label for="star-3" title="???????????? ??3??"></label>  
                        <input type="radio" id="star-2" name="rating" value="2" onClick ={() => setMark(2)}/>
                        <label for="star-2" title="???????????? ??2??"></label>    
                        <input type="radio" id="star-1" name="rating" value="1" onClick ={() => setMark(1)}/>
                        <label for="star-1" title="???????????? ??1??"></label>
                    </div>
                    <textarea rows = "6"  placeholder = "?????? ??????????????????????..." className = "user-comment" value ={comment} onChange = {(event) => setComment(event.target.value)}/>
                    <button className = "send-comment-btn" onClick = {sendComment}>???????????????? ??????????????????????</button>
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
                        <p className = "comment-text">{`??????????????????????: ${item.comment_text}`}</p>
                </div>)}
                {!itemComments && <div className = "no-comments">
                    <p>???????????? ?????????????????????? :(</p>
                </div>}
            </div>
        </div>
    </div>
}