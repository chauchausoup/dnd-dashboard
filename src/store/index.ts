import { configureStore } from '@reduxjs/toolkit';
import spellsReducer from './spellsSlice';

const store = configureStore({
  reducer: {
    spells: spellsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;