import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import boardSlice from './boardSlice';
import cardSlice from './cardSlice';
import taskSlice from './taskSlice';
import githubSlice from './githubSlice';


const store = configureStore({
    reducer: {
        auth: authSlice,
        board: boardSlice,
        card: cardSlice,
        task: taskSlice,
        github: githubSlice
    }
})

export default store;