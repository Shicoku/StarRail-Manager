import { calculateScore } from "../utils/scorer";
import { parseChar } from "../utils/JsonParser";
import { renderImg } from "../utils/renderImg";
import { charData } from "../types//starrail";
import { ApiError } from "../errors/ApiError";
import { createCanvas } from "canvas";

interface ClientOptions {
  lang?: string;
}

const languages = ["cht", "cn", "de", "en", "es", "fr", "id", "jp", "kr", "pt", "ru", "th", "vi"] as const;
type SupportedLang = (typeof languages)[number];

export class Client {
  private lang: string;

  constructor(options: ClientOptions = {}) {
    this.lang = options.lang ?? "en";
    if (!languages.includes(this.lang as SupportedLang)) {
      throw new Error(`The Language is not supported: ${options.lang}`);
    }
  }

  async getUserData(uid: number): Promise<any> {
    const url = `https://api.mihomo.me/sr_info_parsed/${uid}?lang=${this.lang}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new ApiError(`Fetch failed: ${res.statusText}`, res.status);
      }

      return await res.json();
    } catch (err) {
      throw new ApiError("Fetch error", err);
    }
  }

  async getCharData(uid: number, index: number): Promise<charData | null> {
    const data = await this.getUserData(uid);
    const parsed = parseChar(data, index);
    if (!parsed) return null;

    const scoreData = calculateScore(parsed);
    return scoreData;
  }

  async createImg(uid: number, index: number): Promise<ReturnType<typeof createCanvas> | null> {
    this.lang = "jp";
    const data = await this.getCharData(uid, index);
    if (!data) return null;

    return await renderImg(data);
  }
}
