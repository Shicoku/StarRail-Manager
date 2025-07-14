import { charData, Skill, RankIcon, LightCone, Relic, RelicSet, Status } from "../types/starrail";
import { config } from "../config";

export function parseChar(data: any, index: number): charData | null {
  if (!data || !data.characters || !data.characters[index]) return null;
  const char = data.characters[index];

  const skill: Skill[] = char.skills.slice(0, 4).map((s: any) => ({
    level: s.level,
    icon: config.StarRailPath + s.icon,
  }));

  const rank_icons: RankIcon[] = Array.from({ length: 6 }, (_, i) => ({
    icon: config.StarRailPath + char.rank_icons[i],
    lock: i >= char.rank ? true : false,
  }));

  const light_cone: LightCone | undefined = char.light_cone
    ? ({
        name: char.light_cone.name,
        rarity: char.light_cone.rarity,
        rank: char.light_cone.rank,
        icon: config.StarRailPath + char.light_cone.preview,
        attributes: char.light_cone.attributes.map((a: any) => ({
          name: a.name,
          icon: config.StarRailPath + a.icon,
          val: a.display,
        })),
      } as LightCone)
    : undefined;

  const relics: Relic[] =
    char.relics?.map((r: any) => ({
      name: r.name,
      rarity: r.rarity,
      level: r.level,
      icon: config.StarRailPath + r.icon,
      score: 0,
      part: r.type,
      main_affix: {
        type: r.main_affix.type,
        name: cleanAffixName(r.main_affix.name),
        icon: config.StarRailPath + r.main_affix.icon,
        val: r.main_affix.value,
        dis: r.main_affix.display,
      },
      sub_affix: r.sub_affix.map((s: any) => ({
        type: s.type,
        name: cleanAffixName(s.name),
        icon: config.StarRailPath + s.icon,
        val: s.value,
        dis: s.display,
      })),
    })) ?? [];

  const relic_sets: RelicSet[] =
    char.relic_sets?.map((rs: any) => ({
      name: rs.name,
      icon: config.StarRailPath + rs.icon,
      num: rs.num,
    })) ?? [];

  const status: Status[] = char.additions.map((add: any) => {
    let val = add.display;
    const match = char.attributes.find((attr: any) => attr.name === add.name);
    if (match) {
      val = add.percent ? ((add.value + match.value) * 100).toFixed(1) + "%" : (add.value + match.value).toFixed(0);
    }
    return {
      name: cleanAffixName(add.name),
      icon: config.StarRailPath + add.icon,
      val,
    };
  });

  const orderedNames = ["HP", "攻撃力", "防御力", "速度", "会心率", "会心ダメ", "撃破特効", "EP回復効率", "効果命中", "効果抵抗", "治癒量", "属性ダメ"];

  status.sort((a, b) => orderedNames.indexOf(a.name) - orderedNames.indexOf(b.name));

  return {
    uid: data.player.uid,
    id: char.id,
    name: char.name,
    level: char.level,
    icon: config.StarRailPath + char.portrait,
    total_score: 0,
    skill,
    rank_icons,
    path: config.StarRailPath + char.path.icon,
    element: config.StarRailPath + char.element.icon,
    light_cone,
    relics,
    relic_sets,
    status,
  };
}

function cleanAffixName(name: string): string {
  return name
    .replace(/..?属性ダメージ/, "属性ダメ")
    .replace("会心ダメージ", "会心ダメ")
    .replace("EP回復効率", "EP回復");
}
