import { useState, useEffect, useRef, useCallback } from "react";

export const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null); // mutable ref to store current callback
  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb; // store passed callback to ref
    setState((prev) =>
      typeof newState === "function" ? newState(prev) : newState
    );
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state); // invoke callback after state update
      cbRef.current = null; // reset callback after invoke
    }
  }, [state]);

  return [state, updateState];
};
