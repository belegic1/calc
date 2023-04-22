import { createContext, useContext } from 'react';

export const DragContext = createContext(null);

export const useDrag = () => useContext(DragContext);
