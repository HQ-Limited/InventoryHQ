import { createContext } from 'react';
import { Location } from './types/EditProductTypes';

export const Context = createContext<{
    isVariable: boolean;
    locations: Location[];
    variationAttributeErrors: { index: number; errorFieldNames: (string | number)[][] }[];
    setVariationAttributeErrors: (
        errors: { index: number; errorFieldNames: (string | number)[][] }[]
    ) => void;
}>({
    isVariable: false,
    locations: [],
    variationAttributeErrors: [],
    setVariationAttributeErrors: () => {},
});
