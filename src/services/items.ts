import axios from "axios";
import { Item } from "../models/item";

class ItemsService {
  async getAll(): Promise<Item[]> {
    const res = await axios.get(
      "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete"
    );
    return res.data;
  }
}

const itemsService = new ItemsService();

export default itemsService;
