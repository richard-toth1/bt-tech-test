import { ApiResource } from "../utils/types";
import { AuctionPicture } from "./AuctionPicture";

export interface AuctionOwner extends ApiResource {
  username: string;
}
export interface AuctionBid extends ApiResource {
  price: number;
}

export interface Auction extends ApiResource {
  title: string;
  description: string;
  picture: AuctionPicture;
  startingPrice: number;
  closingTime: string;
  auctionStatus: any;
  owner: AuctionOwner;
  bids: AuctionBid[];
}
