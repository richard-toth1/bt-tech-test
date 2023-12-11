import { Item } from "./item";

export class Auction implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public title?: string,
    public description?: string,
    public picture?: string[],
    public startingPrice?: number,
    public closingTime?: Date,
    public auctionStatus?: any,
    public owner?: any,
    public bids?: string[]
  ) {
    this["@id"] = _id;
  }
}
