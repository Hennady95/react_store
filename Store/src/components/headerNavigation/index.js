import './style.css'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export const HeaderNavigation = () => {

    const dispatch = useDispatch();

    const signIn = useSelector(state => state.signIn);
    const categoryTitle = useSelector(state => state.categoryTitle);
    const categoryPath = useSelector(state => state.categoryPath);

    return <div className = "header-navigation">
        <Link className = "header-link" to = '/'>Главная</Link>
        <Link className = "header-link" to = '/catalog' onClick = {() => dispatch({type: "DELETE_ITEM"})}>Каталог</Link>
        <Link className = "header-link" to = {`/catalog/${categoryPath}`} onClick = {() => dispatch({type: "DELETE_ITEM"})}>{categoryTitle}</Link>
        {signIn && <Link className = "header-link" to = '/purchaseHistory'>История покупок</Link>}
    </div>
}