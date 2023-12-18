import { AuthContextData } from "../context/AuthProvider";

export const isBuyer = (auth: AuthContextData) => {
  return auth.roles?.includes("ROLE_BUYER");
};

export const isSeller = (auth: AuthContextData) => {
  return auth.roles?.includes("ROLE_SELLER");
};
