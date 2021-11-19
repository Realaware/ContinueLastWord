import axios from "axios";
import BotConfig from "../../config.json";
import { DOMParser } from "@xmldom/xmldom";

export default async function isValidWord(word: string): Promise<boolean> {
  const { data, status } = await axios.get(
    `https://krdict.korean.go.kr/api/search`,
    {
      params: {
        key: BotConfig.apikey,
        type_search: "search",
        part: "word",
        q: word,
        sort: "dict",
      },
      validateStatus: null,
    }
  );

  if (status !== 200) {
    return false;
  }

  const doc = new DOMParser().parseFromString(data, "text/xml");
  const item = doc.getElementsByTagName("item")[0];

  return !item
    ? false
    : item.getElementsByTagName("word")[0].firstChild?.nodeValue === word;
}
