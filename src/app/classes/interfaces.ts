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
