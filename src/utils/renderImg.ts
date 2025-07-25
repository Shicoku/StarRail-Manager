import { Canvas, createCanvas, loadImage, registerFont } from "canvas";
import { charData } from "../types/starrail";
import { config } from "../config";
import path from "path";
import fs from "fs";

export async function renderImg(data: charData): Promise<Canvas> {
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext("2d");

  registerFont(path.resolve(__dirname, "../assets/font/kt.ttf"), { family: "kt" });

  // 背景画像
  await loadImage(filePath("../assets/img/back.png")).then((img) => {
    ctx.drawImage(img, 0, 0, 1920, 1080);
  });

  // キャラ描画
  await loadImage(data["icon"]).then((img) => {
    ctx.drawImage(img, 200, -90, img.width / 1.5, img.height / 1.5);
  });

  // 属性と運命アイコン描画
  await loadImage(data["element"]).then((img) => {
    ctx.drawImage(img, 160, 75, img.width / 5, img.height / 5);
  });
  await loadImage(data["path"]).then((img) => {
    ctx.drawImage(img, 220, 79, img.width / 10, img.height / 10);
  });

  // 枠描画
  await loadImage(filePath("../assets/img/front.png")).then((img) => {
    ctx.drawImage(img, 0, 0, 1920, 1080);
  });

  // ステータス描画
  let inter = 0;
  if (data["status"].length == 11) inter = 55;
  if (data["status"].length == 10) inter = 60;
  if (data["status"].length == 9) inter = 65;
  for (let i = 0; i < data["status"].length; i++) {
    await loadImage(data["status"][i]["icon"]).then((img) => {
      ctx.drawImage(img, 40, 155 + i * inter, img.width / 2.3, img.height / 2.3);

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.font = '38px "kt"';
      ctx.fillText(data["status"][i]["name"], 95, 200 + i * inter);
      ctx.textAlign = "right";
      ctx.fillText(data["status"][i]["val"], 470, 200 + i * inter);
      ctx.textAlign = "start";
    });
  }

  // 光円錐描画
  if (data.light_cone) {
    {
      const img = await loadImage(data.light_cone.icon);
      ctx.font = '20px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(data.light_cone.name, 250, 830);
      ctx.font = '35px "kt"';
      ctx.fillText("Lv. " + data.light_cone.level + " R" + data.light_cone.rank, 250, 880);

      ctx.drawImage(img, 50, 810, 160.5, 199);
    }
    {
      const img = await loadImage(filePath("../../../../" + config.StarRailPath + "icon/deco/Rarity" + data["light_cone"]["rarity"] + ".png"));
      if (data["light_cone"]["rarity"] == 3) ctx.drawImage(img, -25, 950, img.width / 1.5, img.height / 1.5);
      else if (data["light_cone"]["rarity"] == 4) ctx.drawImage(img, -45, 950, img.width / 1.5, img.height / 1.5);
      else ctx.drawImage(img, -55, 950, img.width / 1.5, img.height / 1.5);
    }
    for (let i = 0; i < data["light_cone"]["attributes"].length; i++) {
      const img = await loadImage(data["light_cone"]["attributes"][i]["icon"]);
      ctx.drawImage(img, 240, 880 + i * 40, img.width / 2.5, img.height / 2.5);

      ctx.font = "30px 'kt'";
      ctx.fillText(data["light_cone"]["attributes"][i]["name"], 300, 920 + i * 40);
      ctx.textAlign = "right";
      ctx.fillText(data["light_cone"]["attributes"][i]["val"], 470, 920 + i * 40);
      ctx.textAlign = "start";
    }
  }

  // 軌跡描画
  for (let i = 0; i < data["skill"].length; i++) {
    const img = await loadImage(data["skill"][i]["icon"]);
    ctx.drawImage(img, 540, 220 + i * 150, img.width / 1.3, img.height / 1.3);
    ctx.font = '40px "kt"';
    ctx.fillStyle = "rgb(255, 255, 255)";
    const skill = data.skill?.[i];
    const level = skill.level.toString();
    const x = level.length === 1 ? 575 : 560;
    ctx.fillText(level, x, 355 + i * 150);
  }

  // 凸数描画
  for (let i = 0; i < data["rank_icons"].length; i++) {
    await loadImage(data["rank_icons"][i]["icon"]).then((img) => {
      ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
    });
    if (data["rank_icons"][i]["lock"] == true) {
      await loadImage(filePath("../assets/img/back_icon.png")).then((img) => {
        ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
      });
    }
  }

  // 遺物描画
  if (data["relics"]) {
    for (let i = 0; i < data["relics"].length; i++) {
      await loadImage(data["relics"][i]["icon"]).then((img) => {
        ctx.drawImage(img, 1240, 55 + i * 170, img.width, img.height);
      });
      await loadImage(data["relics"][i]["main_affix"]["icon"]).then((img) => {
        ctx.drawImage(img, 1350, 70 + i * 170, img.width / 2.6, img.height / 2.6);
        ctx.font = "30px 'kt'";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText(data["relics"][i]["main_affix"]["name"], 1400, 105 + i * 170);
        ctx.textAlign = "right";
        ctx.font = "40px 'kt'";
        ctx.fillText(data["relics"][i]["main_affix"]["dis"], 1480, 155 + i * 170);
        ctx.fillRect(1530, 50 + i * 170, 5, 150);
        ctx.textAlign = "start";
      });
      await loadImage(filePath("../../../../" + config.StarRailPath + "icon/deco/Rarity" + data["relics"][i]["rarity"] + ".png")).then((img) => {
        ctx.drawImage(img, 1180, 140 + i * 170, img.width / 2, img.height / 2);
        ctx.font = "25px 'kt'";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText("Lv. " + data["relics"][i]["level"], 1430, 185 + i * 170);
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeText("Lv. " + data["relics"][i]["level"], 1430, 185 + i * 170);
      });

      for (let j = 0; j < data["relics"][i]["sub_affix"].length; j++) {
        await loadImage(data["relics"][i]["sub_affix"][j]["icon"]).then((img) => {
          ctx.drawImage(img, 1540, 50 + (i * 170 + j * 34), img.width / 2.7, img.height / 2.7);
          ctx.font = "25px 'kt'";
          ctx.fillStyle = "rgb(255, 255, 255)";
          ctx.fillText(data["relics"][i]["sub_affix"][j]["name"], 1590, 80 + (i * 170 + j * 34));
          ctx.font = '25px "kt"';
          ctx.fillStyle = "rgba(255, 255, 255)";
          ctx.textAlign = "right";
          ctx.fillText(data["relics"][i]["sub_affix"][j]["dis"], 1765, 80 + (i * 170 + j * 34));
          ctx.strokeStyle = "rgb(255, 255, 255)";
          ctx.strokeText(data["relics"][i]["sub_affix"][j]["dis"], 1765, 80 + (i * 170 + j * 34));
          ctx.textAlign = "start";
        });
      }
    }
  }

  // 遺物セット描画
  if (data["relic_sets"]) {
    let i = 0;
    let point = 0;
    if (data["relic_sets"][0]["name"] == data["relic_sets"][1]["name"]) i = 1;
    for (i; i < data["relic_sets"].length; i++) {
      await loadImage(data["relic_sets"][i]["icon"]).then((img) => {
        ctx.drawImage(img, 680 + point * 130, 820, 70, 70);

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.textAlign = "left";
        ctx.font = '30px "kt"';
        ctx.fillText("x" + data["relic_sets"][i]["num"], 750 + point * 130, 870);
      });
      point++;
    }
  }

  // キャラ名描画
  ctx.font = '60px "kt"';
  ctx.textAlign = "start";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText(data["name"], 40, 70);

  // キャラレベル描画
  ctx.font = '35px "kt"';
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Lv. " + data["level"], 45, 120);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText("Lv. " + data["level"], 45, 120);

  // スコア描画
  ctx.font = '40px "kt"';
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Total Score", 690, 950);
  ctx.font = '80px "kt"';
  ctx.fillText(data.total_score.toString(), 700, 1030);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText(data.total_score.toString(), 700, 1030);

  let scoreRank = "D";
  if (data["total_score"] >= 600) scoreRank = "SS";
  else if (data["total_score"] >= 540) scoreRank = "S";
  else if (data["total_score"] >= 360) scoreRank = "A";
  else if (data["total_score"] >= 240) scoreRank = "B";
  else if (data["total_score"] >= 60) scoreRank = "C";
  ctx.font = '130px "kt"';
  ctx.fillText(scoreRank, 920, 1030);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText(scoreRank, 920, 1030);

  // 遺物スコア描画
  if (data["relics"]) {
    for (let i = 0; i < data["relics"].length; i++) {
      ctx.fillRect(1780, 50 + i * 170, 5, 150);
      ctx.font = '30px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText("Score", 1795, 90 + i * 170);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeText("Score", 1795, 90 + i * 170);
      ctx.font = '35px "kt"';
      const relic = data.relics?.[i];
      if (relic && typeof relic.score === "string") {
        ctx.fillText(relic.score, 1800, 130 + i * 170);
        ctx.strokeText(relic.score, 1800, 130 + i * 170);
      }
      let scoreRank = "D";
      const score = Number(data.relics?.[i].score);
      if (score >= 100) scoreRank = "SS";
      else if (score >= 90) scoreRank = "S";
      else if (score >= 60) scoreRank = "A";
      else if (score >= 40) scoreRank = "B";
      else if (score >= 10) scoreRank = "C";
      ctx.fillText(scoreRank, 1830, 180 + i * 170);
      ctx.strokeText(scoreRank, 1830, 180 + i * 170);
    }
  }

  return canvas;
}

/**
 * 指定ファイルへの絶対パスを返す
 * @param relativePath - __dirname ぁらの相対パス
 * @returns 絶対パス(string)
 */
function filePath(relativePath: string): any {
  return fs.readFileSync(path.resolve(__dirname, relativePath));
}

function fromEntry(Path: string): any {
  const entryDir = path.dirname(require.main?.filename ?? process.argv[1]);
  return fs.readFileSync(path.resolve(entryDir, Path));
}
