import { useEffect } from "react";

import { AppDispatch } from "@/store";
import { fetchAllSpells } from "@/store/spellsSlice";

interface Spell {
  index: string;
  name: string;
  level: number;
  url: string;
  [key: string]: any;
}

export function useFetchSpells(
  dispatch: AppDispatch,
  allSpells: Spell[],
  loadingAllSpells: boolean
) {
  useEffect(() => {
    if (allSpells.length === 0 && !loadingAllSpells) {
      dispatch(fetchAllSpells());
    }
  }, [allSpells.length, loadingAllSpells, dispatch]);
}
