export interface LoginRequest{
    username:string;
    password:string;
}
export interface LoginResponse{
    token:string;
    refreshToken:string;
}

export interface UserRequest{
    username:string;
    password:string;
}

export interface RoleResponse{
    id:number;
    roleName:string;
}

export interface UserResponse{
    id:number;
    username:string;
    roles:RoleResponse[];
}

export interface ProductResponse{
    id: string;
    nomProduct:string;
    price:number;
    createdAt:Date;
    updatedAt:Date;
}

export interface ProductRequest{
    nomProduct:string;
    price:number;
}

export interface LigneFacturationDto {
    product: ProductResponse;
    quantity: number;
    price: number;
}

export interface FacturationDto {
    clientName: string;
    clientPhoneNumber: string;
    lignesFacturation: LigneFacturationDto[];
}

export interface FacturationResponse {
    id: string;
    numfacture:string,
    clientName: string;
    clientPhoneNumber: string;
    lignesFacturation: LigneFacturationDto[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}
