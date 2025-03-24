// Product interface is already defined in product.type.ts
// Category interface
export interface Category {
    id: number;
    name: string;
    displayName: string;
    description: string;
  }
  
  // Order Item interface
  export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }
  
  // Address interface
  export interface Address {
    fullName: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
    isDefault?: boolean;
  }
  
  // Payment Method interface
  export interface PaymentMethod {
    type: 'creditCard' | 'paypal' | 'applePay' | 'googlePay';
    cardNumber?: string;
    nameOnCard?: string;
    expirationDate?: string;
    cvv?: string;
  }
  
  // Order interface
  export interface Order {
    id: number;
    customerId?: string;
    items: OrderItem[];
    shippingAddress: Address;
    billingAddress: Address;
    paymentMethod: PaymentMethod;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    trackingNumber?: string;
    notes?: string;
  }
  