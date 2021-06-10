export const addBasketItem = (payload) => {
    return {
        type: "ADD_BASKET_ITEM",
        payload
    }
}

export const deleteCurrentItem = () => {
    return {
        type: "DELETE_ITEM"
    }
}

export const setUser = (payload) => {
    return {
        type: "SET_USER",
        payload: {...payload}
    }
}

export const clearBasket = () => {
    return {
        type: "CLEAR_BASKET"
    }
}

export const minusItemCount = (payload) => {
    return {
        type: "DELETE_ITEM_COUNT",
        payload
    }
}

export const plusItemCount = (payload) => {
    return {
        type: "ADD_ITEM_COUNT",
        payload
    }
}

export const deleteBasketItem = (payload) => {
    return {
        type: "DELETE_BASKET_ITEM",
        payload
    }
}

export const selectItem = (payload) => {
    return {
        type: "SELECT_ITEM",
        payload
    }
}

export const takeDataSuccess = () => {
    return {
        type: "TAKE_DATA_SUCCESS"
    }
}

export const takeDataFailure = () => {
    return {
        type: "TAKE_DATA_FAILURE"
    }
}

export const selectedCategory = (payload) => {
    return {
        type: "SET_CATEGORY_TITLE",
        payload
    }
}

export const selectedCategoryPath = (payload) => {
    return {
        type: "SET_CATEGORY_PATH",
        payload
    }
}