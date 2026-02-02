export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    rating: number;
    reviews: Review[];
    dimensions?: string;
    stock: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'customer';
    address?: string;
}

export interface Order {
    id: string;
    userId: number;
    items: CartItem[];
    totalAmount: number;
    date: Date;
    status: 'Pending' | 'Paid' | 'Shipped' | 'Delivered';
    paymentId?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Review {
    id: number;
    productId: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    date: Date;
}

export interface Shop {
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    distance?: number; // Calculated at runtime
}
