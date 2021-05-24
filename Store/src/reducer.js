const initialState = {
    signIn: false,
    authUser: null,
    findItemTitle: '',
    categoryTitle: null,
    categoryPath: null,
    basket: [],
    currentItem: null,
    serverError: false
}

export const reducer = (state = initialState, action) => {

    if(action.type === "TAKE_DATA_FAILURE") {
        return {
            ...state,
            serverError: true
        }
    }

    if(action.type === "TAKE_DATA_SUCCESS") {
        return {
            ...state,
            serverError: false
        }
    }

    if(action.type === "CHANGE_FIND_TITLE") {
        return {
            ...state,
            findItemTitle: action.payload
        }
    }

    if(action.type === "DELETE_FIND_TITLE") {
        return {
            ...state,
            findItemTitle: ''
        }
    }

    if(action.type === "SET_USER") {
        return {
            ...state,
            signIn: true,
            authUser: action.payload
        }
    }

    if(action.type === "CLEAR_USER") {
        return {
            ...state,
            signIn: false,
            authUser: null
        }
    }

    if(action.type === "SELECT_ITEM") {
        return {
            ...state,
            currentItem: action.payload 
        }
    }

    if(action.type === "DELETE_ITEM") {
        return {
            ...state,
            currentItem: null 
        }
    }

    if(action.type === "ADD_BASKET_ITEM") {
        const newArr = [...state.basket, action.payload]
        return {
            ...state,
            basket: newArr
        }
    }

    if(action.type === "CLEAR_BASKET") {
        return {
            ...state,
            basket: []
        }
    }

    if(action.type === "SET_CATEGORY_PATH") {
        return {
            ...state,
            categoryPath: action.payload,
        }
    }

    if(action.type === "SET_CATEGORY_TITLE") {
        return {
            ...state,
            categoryTitle: action.payload,
        }
    }

    if(action.type === "CLEAR_CATEGORY") {
        return {
            ...state,
            categoryTitle: null
        }
    }

    if(action.type === "ADD_ITEM_COUNT") {
        state.basket[action.payload].count = state.basket[action.payload].count + 1
        return {
            ...state,
            basket: [...state.basket]
        }
    }

    if(action.type === "DELETE_ITEM_COUNT") {
        if(state.basket[action.payload].count > 1) {
            state.basket[action.payload].count = state.basket[action.payload].count - 1
        }
        return {
            ...state,
            basket: [...state.basket]
        }
    }

    if(action.type === "DELETE_BASKET_ITEM") {
        const newBasket = [...state.basket];
        newBasket.splice(action.payload, 1);
        return {
            ...state,
            basket: [...newBasket]
        }
    }

    return state
}