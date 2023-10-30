import { createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"
import { TOKEN } from "../../constants"

const initialState = {
    isAuthenticated: Boolean(Cookies.get(TOKEN))
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        controlAuthenticated(state, { payload }) {
            state.isAuthenticated = payload
        }
    },

})

export const { controlAuthenticated } = authSlice.actions

export default authSlice.reducer