import './style.css'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { NotFound } from '../../components/notFound';
import { addBasketItem, selectedCategoryPath, selectItem} from '../../actionCreators';

export const CategoryListPage = () => {

    const param = useParams();

    const dispatch = useDispatch();

    const currentItem = useSelector(state => state.currentItem);
    const [dataError,setDataError] = useState(false);

    const [categoryItems, setItems] = useState(null);

    const [fillters,setFilters] = useState(null);

    const [currentFillters, setCurrentFilters] = useState(null);

    useEffect(() => {
        const getData = async() => {
            try {
                const response = await axios.get(`http://localhost:3002/category/${param.category}`);
                const filterData = await axios.get(`http://localhost:3002/fillters/${param.category}`)
                setItems(response.data);
                setFilters(filterData.data);
                dispatch(selectedCategoryPath(param.category));
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
        }
        getData();
    },[param,dispatch] )

    const buyItem = useCallback( (item) => {
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
        dispatch(addBasketItem(newBasketItem));
    }, [dispatch, param])

    const searchProducts = useCallback( async () => {
        const data = await axios.get(`http://localhost:3002/category/${param.category}`);
        const newData = data.data.reduce((newArrProducts,product) => {
            let countFillters = 0;
            let successFillter = 0;
            for(let i = 0; i < product.tags.length; i++) {
                const newString = currentFillters[i].reduce((str,item) => item !== '' ? str += `${item} ` : str,'')
                if(newString.length !== 0) {
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
    } , [currentFillters, param])

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
                <button className = "fillter-btn" onClick = {searchProducts}>??????????????????????????</button>
            </div>
            <div className = "items-container">
                {categoryItems && categoryItems.map((item,index) => <div key = {index} className = "category-item">
                    <p className = "category-item-price">{`${item.price} ??????`}</p>
                    <img src = {item.src} alt = {item.title}/>
                    <p className = "category-item-title">{item.title}</p>
                    <div className = "item-controll"> 
                        <button className = "show-item-btn" onClick = {() => dispatch(selectItem(item))}/>
                        <button className = "buy-item-btn" onClick = {() => buyItem(item)}/>
                    </div>
                </div>)}
                {categoryItems && categoryItems.length === 0 && <p className = "category-item-title" style = {{padding: '20px'}}>???????????? ???? ???????????????? ?????????????????? ???? ??????????????...</p>}
            </div>
        </div>}
        {dataError && <NotFound/>}
        {currentItem && <Redirect to = {`/catalog/${param.category}/${currentItem.title}`}/>}
    </div>
}