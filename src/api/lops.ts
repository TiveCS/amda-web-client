import axios from "axios";
import { LOPS_URL } from "./routes";

export async function getLops() {
  return await axios.get(LOPS_URL, {
    withCredentials: true,
  });
}
