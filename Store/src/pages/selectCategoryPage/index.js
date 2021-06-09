import './style.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotFound } from '../../components/notFound'

export const SelectCategoryPage = () => {

    const dispatch = useDispatch();

    const [categoryItems, setCategoryItems] = useState([]);
    const dataError = useSelector(state => state.serverError);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('http://localhost:3002/category')
                setCategoryItems(response.data);
                dispatch({type: "TAKE_DATA_SUCCESS"});
            } catch (err) {
                dispatch({type: "TAKE_DATA_FAILURE"});
            }
        }
        getData();
    },[dispatch])

    return <div className = "category-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        {!dataError &&categoryItems && categoryItems.map((category,index) =>
            <Link key ={index} className = "category-container" to = {`/catalog/${category.path}`} onClick = {() => dispatch({type: "SET_CATEGORY_TITLE", payload: category.title})}>
                <p className = "category-title">{category.title}</p>
                <img src = {category.pictchure} className = "category-icon" alt = {category.title}/>
            </Link>
        )}
        {dataError && < NotFound />}
    </div>
} 