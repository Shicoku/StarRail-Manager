import { config } from "../config";
import { charDataBase } from "../types/charDataBase";
import path from "path";
import fs from "fs";

interface ClientOptions {
  lang?: string;
}

const languages = ["cht", "cn", "de", "en", "es", "fr", "id", "jp", "kr", "pt", "ru", "th", "vi"] as const;
type SupportedLang = (typeof languages)[number];

export class Character {
  private lang: string;

  constructor(options: ClientOptions = {}) {
    this.lang = options.lang ?? "en";
    if (!languages.includes(this.lang as SupportedLang)) {
      throw new Error(`The Language is not supported: ${options.lang}`);
    }
  }

  data(id: number) {
    const light_cone = JSON.parse(fs.readFileSync(`${config.StarRailPath}/index_min/${this.lang}/light_cones.json`, "utf-8"));
    return light_cone[id];
  }

  rank(id: number) {
    const light_cone = JSON.parse(fs.readFileSync(`${config.StarRailPath}/index_min/${this.lang}/light_cone_ranks.json`, "utf-8"));
    return light_cone[id];
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
