import { Item } from "./item";

export class Bid implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public auction?: string[],
    public price?: number,
    public owner?: any
  ) {
    this["@id"] = _id;
  }
}
