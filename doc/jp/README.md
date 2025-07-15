# StarRail Manager
[EN here](../../README.md)\
StarRail Managerは、node.js用のMiHoMo APIラッパー、スターレイルのデータを取得するライブラリです。

> [!WARNING]
> このプロジェクトは現在ベータ版です。\
> 今後のアップデートで大きく変更される可能性があります。

## インストール

```
$ npm install starrail-manager
```
> [!WARNING]
> 現状、npmは未公開です。\
> 今後公開する予定です。


## 使い方
### MiHoMo API取得
```js
const { Client } = require("starrail-manager");

const client = new Client({lang: "jp"}); // デフォルトはen(英語)
const mihomoData = await client.getUserData(830647229);
console.log(mihomoData);
```

### ビルドカード作成
```js
const { Client } = require("starrail-manager");
const fs = require("fs");

const client = new Client();
client.createImg(830647229, 0).then((canvas) => {
  fs.writeFileSync("output.png", canvas.toBuffer());
});
```

> [!WARNING]
> ビルドカードの作成は日本語にのみ対応しています。

### キャラクターのデータを取得する
```js
const { Character } = require("starrail-manager");

const char = new Character({lang: "jp"});
const charData = char.getCharBase(1001);
console.log(charData.name);

// result
// 三月なのか
```

### 光円錐のデータを取得する
```js
const { LightCone } = require("starrail-manager");

const light_cone = new LightCone({lang: "jp"});
const data = light_cone.getData(22001);
console.log(data.name);

// result
// よぉ、ここにいるぜ
```

# APIとデータ
## API
本パッケージでは`MiHoMo API`を使用しています。\
**[MiHoMo API](https://march7th.xyz/en/)**

## データ
キャラクターデータ、光円錐データ、およびその他のデータは`StarRailRes`を参照しています。\
**[StarRailRes](https://github.com/Mar-7th/StarRailRes)**\
また、スコア計算に使用する重要度データは`StarRailScore`を参照しています。\
**[StarRailScore](https://github.com/Mar-7th/StarRailScore)**
