import { config } from "../config";
import fs from "fs";

interface ClientOptions {
  lang?: string;
}

const languages = ["cht", "cn", "de", "en", "es", "fr", "id", "jp", "kr", "pt", "ru", "th", "vi"] as const;
type SupportedLang = (typeof languages)[number];

export class LightCone {
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
}
