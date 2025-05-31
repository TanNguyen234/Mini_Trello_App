import {configureStore} from '@reduxjs/toolkit';
import { userSlice } from './userSlice';
import boardSlice from './boardSlice';


const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        board: boardSlice.reducer,
        
    }
})

export default store;