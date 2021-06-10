import axios from 'axios';
import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router';
import './style.css'

export const AutentificationPage = () => {

    const dispatch = useDispatch();

    const redirect = useSelector(state => state.signIn);
    const [registry, setRegistry] = useState(false);
    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [confirmUserPassword, setConfirmUserPassword] = useState('');
    const [error, setError] = useState('');
    const [serverAnswer, setServerAnswer] = useState('');


    const emptyFields = useCallback (() => {
        setUserName('');
        setUserSurname('');
        setUserEmail('');
        setUserPhone('');
        setUserPassword('');
        setConfirmUserPassword('');
        setError('');
        setServerAnswer('');
    },[])

    const registration = useCallback( async () => {
        if(userPassword === confirmUserPassword) {
            const newUser = {
                action: 'registry',
                phone: userPhone,
                password: userPassword,
                name: userName,
                surname: userSurname,
                email: userEmail
            }
            const response = await axios.post('http://localhost:3002/auth', newUser);
            setServerAnswer(response.data);
        } else {
            setError('Введённые пароли не совпадают');
        }        
    }, [confirmUserPassword, userEmail, userName, userSurname, userPassword, userPhone])

    const signIn = useCallback( async () => {
        const userData = {
            action: 'signIn',
            phone: userPhone,
            password: userPassword
        }
        const response = await axios.post('http://localhost:3002/auth', userData);
        const {login, answer} = response.data;
        if(login) {
            dispatch({type: "SET_USER", payload: {...answer}})
        } else {
            setError(answer);
        }
    } , [dispatch, userPhone, userPassword])

    return <div className = "autentification-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "user-form">
            {registry && <p className ="field-title">Имя</p>}
            {registry && <input placeholder = "Введите Ваше имя" onChange = {(event) => {
                setUserName(event.target.value);
                setError('');
            }} value = {userName}/>}
            {registry && <p className ="field-title">Фамилия</p>}
            {registry && <input placeholder = "Введите Вашу фамилию" onChange = {(event) => {
                setUserSurname(event.target.value);
                setError('');
            }} value = {userSurname}/>}
            {registry && <p className ="field-title">Email</p>}
            {registry && <input placeholder = "Введите Вашу почту" onChange = {(event) => {
                setUserEmail(event.target.value);
                setError('');
            }} value = {userEmail}/>}
            {registry ? <p className ="field-title">Телефон</p> : <p className ="field-title">Телефон</p>}
            <input placeholder = "Введите Ваш телефон" onChange = {(event) => {
                setUserPhone(event.target.value);
                setError('');
            }} value = {userPhone}/>
            <p className ="field-title">Пароль</p>
            <input type = "password" placeholder = "Введите Ваш пароль" onChange = {(event) => {
                setUserPassword(event.target.value);
                setError('');
            }} value = {userPassword}/>
            {registry && <p className ="field-title">Подтверждение пароля</p>}
            {registry && <input type = "password" placeholder = "Введите Ваше пароль повторно" onChange = {(event) => {
                setConfirmUserPassword(event.target.value);
                setError('');
            }} value = {confirmUserPassword}/>}
            {error && <p>{error}</p>}
            {serverAnswer && <p>{serverAnswer}</p>}
            <div className = "registration-control">
                {!registry &&<button onClick = {signIn}>Вход</button>}
                {registry && <button onClick = {registration}>Зарегистрироваться</button>}
                <button onClick = {() => {
                    setRegistry(!registry);
                    emptyFields();
                }}>{registry ? 'Вернуть назад' : 'Зарегистрироваться'}</button>
            </div>
        </div>
        {redirect && <Redirect to = {'/catalog'}/>}
    </div>
}