import './style.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FindItems } from '../findItems'

export const Header = () => {

    const dispatch = useDispatch();

    const title = useSelector(state => state.findItemTitle)

    const signIn = useSelector(state => state.signIn);
    const basket = useSelector(state => state.basket);
    const [show, setshow] = useState(false);

    return <div className = "header">
        <p className = "header_logo">Center<sup>PC</sup></p>
        <div className = "header_search-container">
            <input type = "text" placeholder = "Поиск по сайту" className = "header_input" value ={title} onChange = {(event) => dispatch({type: "CHANGE_FIND_TITLE", payload: event.target.value})}/>
            <button className = "header-btn search-btn" onClick = {() => setshow(true)}></button>
        </div>
        {show && <FindItems show = {setshow}/> }
        <div className = "header-contacts">
            <p>МТС: +375(29)-111-11-11</p>
            <p>Email: qweqwe@gamil.com</p>
            <p>Telegramm: qweqwe_Qweasd</p>
        </div>
        <Link className = "header-btn delivery" to = '/delivery'/>
        <Link className = "header-btn basket" to = '/basket' data-text = {basket !== null ? `${basket.length}` : '0'}/>
        {signIn ? <Link className = "header-btn logout" to = '/auth' onClick ={() => dispatch({type: "CLEAR_USER"})}/> : <Link className = "header-btn signin" to = '/auth'/>}
    </div>
}