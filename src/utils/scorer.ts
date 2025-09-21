import { charData } from "../types/starrail";
import path from "path";
import fs from "fs";

type WeightMap = Record<string, any>;

export function calculateScore(json: charData): charData {
  const weight: WeightMap = readJson("../../StarRailScore/score.json");
  const none_path = path.resolve(__dirname, "../../assets/score/none.json");
  const weight_none = JSON.parse(fs.readFileSync(none_path, "utf-8"));
  const max_path = path.resolve(__dirname, "../../assets/score/max_value.json");
  const maxVal = JSON.parse(fs.readFileSync(max_path, "utf-8"));

  let totalScore = 0;

  json.relics = json.relics.map((relic) => {
    const mainType = relic.main_affix.type;
    const part = relic.part;

    const main_weight = weight?.[json.id]?.main?.[part]?.[mainType] ?? weight_none.main?.[part]?.[mainType] ?? 0;

    const mainScore = ((relic.level + 1) / 16) * main_weight * 100;

    const subScore = relic.sub_affix.reduce((sum, affix) => {
      const val = typeof affix.val === "number" ? affix.val : parseFloat(affix.val as string);
      const sub_weight = weight?.[json.id]?.weight?.[affix.type] ?? weight_none.weight?.[affix.type] ?? 0;
      return sum + (val / maxVal[affix.type]) * sub_weight * 100;
    }, 0);

    const relicScore = mainScore * 0.5 + subScore * 0.5;
    totalScore += relicScore;

    return {
      ...relic,
      score: relicScore.toFixed(1),
    };
  });

  json.total_score = Number(totalScore.toFixed(1));
  return json;
}

function readJson(path: string): any {
  return JSON.parse(fs.readFileSync(path, "utf-8"));
}
