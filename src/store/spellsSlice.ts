import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { db, Spell, SpellDetail } from '../db';
import { RootState } from '@/store';

interface SpellWithDetails extends Spell {
  details?: SpellDetail;
}

interface SpellsState {
  allSpells: SpellWithDetails[];
  loading: {
    allSpells: boolean;
    spellDetails: boolean;
  };
  pagination: {
    pageIndex: number;
    rowCount: number;
  };
  error: string | null;
}

const initialState: SpellsState = {
  allSpells: [],
  loading: {
    allSpells: false,
    spellDetails: false,
  },
  pagination: {
    pageIndex: 0,
    rowCount: 10,
  },
  error: null,
};

// utility function to fetch data from a URL
const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};


// thunk to get all spells from indexedDB if present
// if not, it will fetch from the API and store them in Dexie
export const fetchAllSpells = createAsyncThunk<Spell[], void>(
  'spells/fetchAllSpells',
  async () => {
    let spells = await db.spells.toArray();
    if (spells.length === 0) {
      console.log("Fetching from API...");

      const data = await fetchData('https://www.dnd5eapi.co/api/spells');
      spells = data.results as Spell[];
      await db.spells.bulkPut(spells);
    }
    return spells;
  }
);


// thunk to get spell details for a given index
// it checks indexedDB first before using the API
export const fetchSpellDetails = createAsyncThunk<SpellDetail, string>(
  'spells/fetchSpellDetails',
  async (index: string) => {
    console.log(`Fetching details for spell: ${index}`);

    let details = await db.spellDetails.get(index);
    if (!details) {
      details = (await fetchData(`https://www.dnd5eapi.co/api/spells/${index}`)) as SpellDetail;
      await db.spellDetails.put(details);
    }
    return details;
  }
);

const spellsSlice = createSlice({
  name: 'spells',
  initialState,
  reducers: {
    setPagination: (state, action: PayloadAction<{ pageIndex: number; rowCount: number }>) => {
      state.pagination = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSpells.pending, (state) => {
        state.loading.allSpells = true;
        state.error = null;
      })
      .addCase(fetchAllSpells.fulfilled, (state, action: PayloadAction<Spell[]>) => {
        state.loading.allSpells = false;
        state.allSpells = action.payload.map((spell) => ({
          index: spell.index,
          name: spell.name,
          level: spell.level,
          url: spell.url,
        }));
      })
      .addCase(fetchAllSpells.rejected, (state, action) => {
        state.loading.allSpells = false;
        state.error = action.error.message || 'An error occurred';
      })
      .addCase(fetchSpellDetails.pending, (state) => {
        state.loading.spellDetails = true;
        state.error = null;
      })
      .addCase(fetchSpellDetails.fulfilled, (state, action: PayloadAction<SpellDetail>) => {
        state.loading.spellDetails = false;
        const spellIndex = state.allSpells.findIndex(
          (spell) => spell.index === action.payload.index
        );
        if (spellIndex !== -1) {
          state.allSpells[spellIndex] = {
            ...state.allSpells[spellIndex],
            details: action.payload,
          };
        }
      })
      .addCase(fetchSpellDetails.rejected, (state, action) => {
        state.loading.spellDetails = false;
        state.error = action.error.message || 'An error occurred';
      });
  },
});

// selectors
export const selectAllSpells = (state: RootState) => state.spells.allSpells;
export const selectLoadingState = (state: RootState) => state.spells.loading;
export const selectError = (state: RootState) => state.spells.error;
export const selectPagination = (state: RootState) => state.spells.pagination;
export const selectSpellByIndex = (state: RootState, index: string) =>
  state.spells.allSpells.find((spell) => spell.index === index);

// memoized selector for paginated spells
export const selectPaginatedSpells = createSelector(
  [
    selectAllSpells,
    (state: RootState) => state.spells.pagination.pageIndex,
    (state: RootState) => state.spells.pagination.rowCount
  ],
  (allSpells, pageIndex, rowCount) => {
    const start = pageIndex * rowCount;
    const end = start + rowCount;
    return allSpells.slice(start, end);
  }
);

// memoized selector for missing spell indexes
export const selectMissingSpellIndexes = createSelector(
  [selectPaginatedSpells],
  (paginatedSpells) => {
    return paginatedSpells
      .filter((spell) => !spell.details)
      .map((spell) => spell.index);
  }
);

export const { setPagination } = spellsSlice.actions;
export default spellsSlice.reducer;