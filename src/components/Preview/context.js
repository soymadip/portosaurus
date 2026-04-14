import { createContext, useContext, useReducer, useCallback } from "react";

const PreviewContext = createContext(null);

function getInitialState() {
  if (typeof window === "undefined") {
    return { isOpen: false, isDocked: false, dockWidth: 420, sources: [], activeIndex: 0 };
  }
  return {
    isOpen: false,
    isDocked: false,
    dockWidth: parseInt(localStorage.getItem("preview-width") || "420", 10),
    sources: [],
    activeIndex: 0,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "OPEN":
      return { ...state, isOpen: true, sources: action.sources, activeIndex: action.index ?? 0 };
    case "CLOSE":
      return { ...state, isOpen: false, isDocked: false };
    case "SET_DOCKED":
      return { ...state, isDocked: action.value };
    case "SET_ACTIVE_INDEX":
      return { ...state, activeIndex: action.index };
    case "SET_DOCK_WIDTH":
      return { ...state, dockWidth: action.width };
    default:
      return state;
  }
}

export function PreviewProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  const openPreview = useCallback((sources, index = 0, hashId = null) => {
    if (hashId && typeof window !== "undefined") {
      window.history.replaceState(null, null, '#' + hashId);
    }
    dispatch({ type: "OPEN", sources, index });
  }, []);

  const closePreview = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.replaceState(null, null, window.location.pathname + window.location.search);
    }
    dispatch({ type: "CLOSE" });
  }, []);

  const setDocked = useCallback((val) => {
    dispatch({ type: "SET_DOCKED", value: val });
  }, []);

  const setActiveIndex = useCallback((index) => {
    dispatch({ type: "SET_ACTIVE_INDEX", index });
  }, []);

  const setDockWidth = useCallback((width) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preview-width", String(width));
    }
    dispatch({ type: "SET_DOCK_WIDTH", width });
  }, []);

  return (
    <PreviewContext.Provider
      value={{ ...state, openPreview, closePreview, setDocked, setActiveIndex, setDockWidth }}
    >
      {children}
    </PreviewContext.Provider>
  );
}

const DEFAULT_CTX = {
  isOpen: false,
  isDocked: false,
  dockWidth: 420,
  sources: [],
  activeIndex: 0,
  openPreview: () => {},
  closePreview: () => {},
  setDocked: () => {},
  setActiveIndex: () => {},
  setDockWidth: () => {},
};

export function usePreview() {
  return useContext(PreviewContext) ?? DEFAULT_CTX;
}
