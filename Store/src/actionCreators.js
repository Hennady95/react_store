const addBasketItem = (payload) => {
    return {
        type: "ADD_BASKET_ITEM",
        payload
    }
}

const deleteCurrentItem = () => {
    return {
        type: "DELETE_ITEM"
    }
}

const setUser = (payload) => {
    return {
        type: "SET_USER",
        payload: {...payload}
    }
}

const clearBasket = () => {
    return {
        type: "CLEAR_BASKET"
    }
}

const minusItemCount = (payload) => {
    return {
        type: "DELETE_ITEM_COUNT",
        payload
    }
}

const plusItemCount = (payload) => {
    return {
        type: "ADD_ITEM_COUNT",
        payload
    }
}

const deleteBasketItem = (payload) => {
    return {
        type: "DELETE_BASKET_ITEM",
        payload
    }
}

const selectItem = (payload) => {
    return {
        type: "SELECT_ITEM",
        payload
    }
}

const takeDataSuccess = () => {
    return {
        type: "TAKE_DATA_SUCCESS"
    }
}

const takeDataFailure = () => {
    return {
        type: "TAKE_DATA_FAILURE"
    }
}

const selectedCategory = (payload) => {
    return {
        type: "SET_CATEGORY_TITLE",
        payload
    }
}