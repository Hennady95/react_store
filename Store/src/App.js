import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import {Header} from './components/header'
import { HeaderNavigation } from './components/headerNavigation'
import { MainPage } from './pages/mainPage'
import { SelectCategoryPage } from './pages/selectCategoryPage'
import { DeliveryPage } from './pages/deliveryPage'
import { CategoryListPage } from './pages/categoryPage'
import { AutentificationPage } from './pages/autentificationPage'
import { BasketPage } from './pages/basketPage'
import { AboutPage } from './pages/aboutItemPage'
import { PurchaseHistory } from './pages/purchaseHistory'

import { reducer } from './reducer'

function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Provider store = {createStore(reducer,applyMiddleware(thunk))}>
            <Header/>
            <HeaderNavigation/>
            <Switch>
              <Route path = {'/catalog/:categoty/:product'} component ={AboutPage} />
              <Route path = {'/catalog/:category'} component = {CategoryListPage} />
              <Route path = {'/purchaseHistory'} component = {PurchaseHistory} />
              <Route path ={'/about'} component = {AboutPage} />
              <Route path ={'/basket'} component = {BasketPage} />
              <Route path ={'/delivery'} component = {DeliveryPage}/>
              <Route path ={'/catalog'} component = {SelectCategoryPage}/>
              <Route path ={'/auth'} component = {AutentificationPage}/>
              <Route path ={'/'} component = {MainPage}/>
            </Switch>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
