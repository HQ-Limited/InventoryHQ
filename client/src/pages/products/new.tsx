// Get all attributes names
const attributes = await fetch('/api/attributes').then((res) => res.data); // [{id: 0, name: 'Size'}, {id:1, name: 'Material'}]

// Activates when adding a new attribute to product. Gets all values of the newly added attribute
const attributeValues = async (id) => {
    const values = await fetch(`/api/attributes/${id}/values`).then((res) => res.data); // [{id: 151, value: 'S'}, {id: 152, value: 'M'}]
    attributes.find((a) => a.id == id).values = values;
    return values;
};

type Attribute = {
    id: number;
    name: string;
    value: string;
};

type Category = {
    id: number;
    name: string;
};

type CommonProductProperties = {
    name: string;
    description: string;
    categories: [Category];
};

type Variation = {
    id: number;
    price: number;
    quantity: number;
    manage_quantity: boolean;
    attributes: [Attribute]; // variational (all variations have the same name, but different values)
};

type SimpleProduct = Variation & CommonProductProperties;

type VariableProduct = CommonProductProperties & {
    id: number;
    attributes: [Attribute]; // global or informational (all variations have the same value)
    variations: [Variation];
};
