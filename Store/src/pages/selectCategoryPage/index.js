import './style.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotFound } from '../../components/notFound';
import { takeDataSuccess, takeDataFailure, selectedCategory} from '../../actionCreators';

export const SelectCategoryPage = () => {

    const dispatch = useDispatch();

    const [categoryItems, setCategoryItems] = useState([]);
    const dataError = useSelector(state => state.serverError);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('http://localhost:3002/category')
                setCategoryItems(response.data);
                dispatch(takeDataSuccess());
            } catch (err) {
                dispatch(takeDataFailure());
            }
        }
        getData();
    },[dispatch])

    return <div className = "category-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "category-wrapper">
            {!dataError &&categoryItems && categoryItems.map((category,index) =>
                <Link key ={index} className = "category-container" to = {`/catalog/${category.path}`} onClick = {() => dispatch(selectedCategory(category.title))}>
                    <p className = "category-title">{category.title}</p>
                    <img src = {category.pictchure} className = "category-icon" alt = {category.title}/>
                </Link>
            )}
        </div>
        {dataError && < NotFound />}
    </div>
} 