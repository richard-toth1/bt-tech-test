import { ApiResource } from "../utils/types";

export interface BidOwner extends ApiResource {
  username: string;
}
export interface Bid extends ApiResource {
  auction: string;
  price: number;
  owner: BidOwner;
}
