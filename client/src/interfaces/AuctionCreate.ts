import { ApiResource } from "../utils/types";
import { AuctionPicture } from "./AuctionPicture";

export interface AuctionCreate extends ApiResource {
  title?: string;
  description?: string;
  picture?: AuctionPicture;
  startingPrice?: number;
  closingTime?: string;
  auctionStatus?: any;
}
