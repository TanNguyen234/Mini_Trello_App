import {configureStore} from '@reduxjs/toolkit';
import { userSlice } from './userSlice';
import boardSlice from './boardSlice';
import cardSlice from './cardSlice';
import taskSlice from './taskSlice';


const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        board: boardSlice.reducer,
        card: cardSlice,
        task: taskSlice
    }
})

export default store;