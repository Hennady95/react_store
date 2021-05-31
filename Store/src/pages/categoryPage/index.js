import './style.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { NotFound } from '../../components/notFound'

export const CategoryListPage = () => {

    const param = useParams();

    const dispatch = useDispatch();

    const currentItem = useSelector(state => state.currentItem);
    const [dataError,setDataError] = useState(false);

    const [categoryItems, setItems] = useState(null);

    const [fillters,setFilters] = useState(null);

    const [currentFillters, setCurrentFilters] = useState(null);

    useEffect(async () => {
        try {
            const response = await axios.get(`http://localhost:3002/category/${param.category}`);
            const filterData = await axios.get(`http://localhost:3002/fillters/${param.category}`)
            setItems(response.data);
            setFilters(filterData.data);
            dispatch({type: "SET_CATEGORY_PATH", payload: param.category});
            setDataError(false);
            let defaultCurrentFillters =[];
            for(let i = 0; i < filterData.data.length; i++) {
                let subArrValue = [];
                for(let j = 0; j < filterData.data[i].items.length; j++) {
                    subArrValue.push('');
                }
                defaultCurrentFillters.push(subArrValue);
            }
            setCurrentFilters(defaultCurrentFillters);
        } catch {
            setDataError(true)
        }
        
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

    const searchProducts = async () => {
        const data = await axios.get(`http://localhost:3002/category/${param.category}`);
        const newData = data.data.reduce((newArrProducts,product) => {
            let countFillters = 0;
            let successFillter = 0;
            for(let i = 0; i < product.tags.length; i++) {
                const newString = currentFillters[i].reduce((str,item) => item !== '' ? str += `${item} ` : str,'')
                if(newString.length != 0) {
                    countFillters += 1;
                    if(RegExp(`${product.tags[i]}`).test(newString)) {
                        successFillter += 1;
                    }
                }
            }
            if(countFillters === successFillter) {
                newArrProducts.push(product);
            }
            return newArrProducts
        }, []);
        setItems(newData);
    }

    return <div className = "catalog-page" style = {{minHeight: `${window.innerHeight - 211}px`}}>
        { !dataError && <div className = "catalog-container">
            <div className = "filter-container">
                {fillters && fillters.map((filter,mainIndex) => <div key ={`${filter.title}`}>
                    <div className = "filter-header">
                        <p className = "filter-title">{filter.title}</p>
                    </div>
                    <div className = "filter-items">
                        {filter.items.map((item,index) =>  <div className = "item-filter" key = {`${item.title}-${index}`}>
                            <input type = 'checkbox' value = {filter.value[index]} onChange = { (event) => {
                                let newArr = [...currentFillters]
                                if(event.target.checked) {
                                    newArr[mainIndex][index] = event.target.value; 
                                } else {
                                    newArr[mainIndex][index] = '';
                                }
                                setCurrentFilters(newArr);
                            } }/>
                            <p className = "filter-item-title">{item}</p>
                        </div>)}
                    </div>
                </div>)}
                <button className = "fillter-btn" onClick = {searchProducts}>Отфильтровать</button>
            </div>
            <div className = "items-container">
                {categoryItems && categoryItems.map((item,index) => <div key = {index} className = "category-item">
                    <p className = "category-item-price">{`${item.price} руб`}</p>
                    <img src = {item.src}/>
                    <p className = "category-item-title">{item.title}</p>
                    <div className = "item-controll"> 
                        <button className = "show-item-btn" onClick = {() => dispatch({type: "SELECT_ITEM",payload: item})}/>
                        <button className = "buy-item-btn" onClick = {() => buyItem(item)}/>
                    </div>
                </div>)}
            </div>
        </div>}
        {dataError && <NotFound/>}
        {currentItem && <Redirect to = {`/catalog/${param.category}/${currentItem.title}`}/>}
    </div>
}