import './style.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export const SelectCategoryPage = () => {

    const dispatch = useDispatch();

    const [categoryItems, setCategoryItems] = useState([]);

    useEffect(async () => {
        const response = await axios.get('http://localhost:3002/category')
        setCategoryItems(response.data);
    },[])

    return <div className = "category-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        {categoryItems && categoryItems.map((category,index) =>
            <Link key ={index} className = "category-container" to = {`/catalog/${category.path}`} onClick = {() => dispatch({type: "SET_CATEGORY_TITLE", payload: category.title})}>
                <p className = "category-title">{category.title}</p>
                <img src = {category.pictchure} className = "category-icon" />
            </Link>
        )}
        {!categoryItems && <p>Huy</p>}
    </div>
} 