export interface CarDTO {
    id: string;
    brand: string;
    name: string;
    about: string;
    rent: {
        period: string;
        price: number;
    },
    fuel_type: string;
    thumbnail: string;
    accessories: {
        id: string;
        type: string;
        name: string;
    }[];
    photos: string[];
}
