import './style.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

export const CategoryListPage = () => {

    const param = useParams();

    const dispatch = useDispatch();

    const currentItem = useSelector(state => state.currentItem);

    const [categoryItems, setItems] = useState(null);

    const [fillters,setFilters] = useState(null);

    useEffect(async () => {
        const response = await axios.get(`http://localhost:3002/category/${param.category}`);
        const filterData = await axios.get(`http://localhost:3002/fillters/${param.category}`)
        setItems(response.data);
        setFilters(filterData.data);
        dispatch({type: "SET_CATEGORY_PATH", payload: param.category})
    },[param,dispatch] )

    const buyItem = (item) => {
        const {id, title, src, price, code} = item;
        const categoryPath = param.category;
        const newBasketItem = {
            id,
            title,
            code,
            categoryPath,
            src,
            price,
            count: 1
        }
        dispatch({ type: "ADD_BASKET_ITEM", payload: newBasketItem});
    }

    return <div className = "catalog-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        <div className = "catalog-container">
            <div className = "filter-container">
                {fillters && fillters.map((filter,index) => <div>
                    <div className = "filter-header">
                        <p className = "filter-title">{filter.title}</p>
                    </div>
                    <div className = "filter-items">
                        {filter.items.map((item,index) =>  <div className = "item-filter">
                            <input type = 'checkbox' value = {filter.value[index]}/>
                            <p className = "filter-item-title">{item}</p>
                        </div>)}
                    </div>
                </div>)}
            </div>
            <div className = "items-container">
                {categoryItems && categoryItems.map((item,index) => <div key = {index} className = "category-item">
                    <p>{`${item.price} руб`}</p>
                    <img src = {item.src}/>
                    <p>{item.title}</p>
                    <div className = "item-controll"> 
                        <button className = "show-item-btn" onClick = {() => dispatch({type: "SELECT_ITEM",payload: item})}/>
                        <button className = "buy-item-btn" onClick = {() => buyItem(item)}/>
                    </div>
                </div>)}
            </div>
        </div>
        {currentItem && <Redirect to = {`/catalog/${param.category}/${currentItem.title}`}/>}
    </div>
}