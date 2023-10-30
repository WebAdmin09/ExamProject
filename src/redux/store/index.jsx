import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import PropTypes from 'prop-types'
import skillReducer from "../slices/skillSlice";
import authReducer from "../slices/authSlice";
import portfolioReducer, { portfolioService, } from "../services/PortfolioServices";
import userReducer, { userService } from "../services/UsersServices";


const reducer = {
    skill: skillReducer,
    auth: authReducer,
    user: userReducer,
    [portfolioService.reducerPath]: portfolioReducer,
    [userService.reducer]: userReducer,

}

export const Store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(portfolioService.middleware)
            .concat(userService.middleware),
});


const StoreProvider = ({ children }) => {
    return <Provider store={Store}>{children}</Provider>
}

StoreProvider.propTypes = {
    children: PropTypes.node,
};

export default StoreProvider