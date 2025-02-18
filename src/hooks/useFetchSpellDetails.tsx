
import { useRef, useEffect } from "react";
import { AppDispatch } from "@/store";
import { fetchSpellDetails } from "@/store/spellsSlice";

export function useFetchSpellDetails(
  dispatch: AppDispatch,
  missingSpellIndexes: string[],
  loadingSpellDetails: boolean
) {
  const dispatchedSpellDetailsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!loadingSpellDetails && missingSpellIndexes.length > 0) {
      missingSpellIndexes.forEach((spellIndex) => {
        if (!dispatchedSpellDetailsRef.current.has(spellIndex)) {
          dispatchedSpellDetailsRef.current.add(spellIndex);
          dispatch(fetchSpellDetails(spellIndex));
        }
      });
    }
  }, [missingSpellIndexes, loadingSpellDetails, dispatch]);

  return dispatchedSpellDetailsRef;
}