import { createContext } from 'react';
import { Location } from './types/EditProductTypes';

export const Context = createContext<{
    isVariable: boolean;
    locations: Location[];
}>({
    isVariable: false,
    locations: [],
});
