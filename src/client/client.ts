import { calculateScore } from "../utils/scorer";
import { parseChar } from "../utils/JsonParser";
import { renderImg } from "../utils/renderImg";
import { charData } from "../types//starrail";
import { charDataBase } from "../types/charDataBase";
import { ApiError } from "../errors/ApiError";
import { createCanvas } from "canvas";
import { config } from "../config";
import path from "path";
import fs from "fs";

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

  getCharBase(name: string): any {
    const charData = JSON.parse(fs.readFileSync(config.StarRailPath + `index_min/${this.lang}/characters.json`, "utf-8"));
    for (const id in charData) {
      const char = charData[id];
      if (char.name.includes(name)) {
        return char;
      }
    }
    return null;
  }

  getCharWeight(name: string, num: number | null): any {
    const charDataSelf = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../assets/score/score_self.json"), "utf-8"));
    const charId = this.getCharBase(name).id;
    let length = 0;

    if (charDataSelf[charId] !== undefined) length = charDataSelf[charId].length;
    if (num == null) {
      return length + 1;
    } else if (num == 0) {
      const charData = JSON.parse(fs.readFileSync(config.scorePath + "score.json", "utf-8"));
      return charData[charId];
    } else {
      if (charDataSelf[charId] === undefined) return `${this.getCharBase(name).name} の重要度データがありません。`;
      return charDataSelf[charId][num - 1];
    }
  }

  setCharWeight(name: string, data: charDataBase): any {
    const charData = this.getCharBase(name);
    const charId = charData.id;
    const charName = charData.name;
    const charDataSelf = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../assets/score/score_self.json"), "utf-8"));

    if (charDataSelf[charId]) {
      charDataSelf[charId].push(data);
    } else {
      charDataSelf[charId] = [data];
    }

    fs.writeFileSync(path.resolve(__dirname, "../assets/score/score_self.json"), JSON.stringify(charDataSelf, null, 2), "utf-8");
    return `${charName} の重要度データを作成しました。`;
  }
}
