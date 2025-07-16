# StarRail Manager

##### English | [日本語](./doc/jp/README.md)

## Overview
The StarRail Manager is a Node.js wrapper for the MiHoMo API and StarRail Data used in Honkai: StarRail.\
**This is not an official Honkai: StarRail project**

> [!WARNING]
> This project is in beta.\
> It may undergo significant changes in future updates.

## Install

```
$ npm install starrail-manager
```

## How to use
### Fetching data from MiHoMo API
```js
const { Client } = require("starrail-manager");

const client = new Client({lang: "jp"}); // default is en
const mihomoData = await client.getUserData(830647229);
console.log(mihomoData);
```

### Creating a Build Card
```js
const { Client } = require("starrail-manager");
const fs = require("fs");

const client = new Client();
client.createImg(830647229, 0).then((canvas) => {
  fs.writeFileSync("output.png", canvas.toBuffer());
});
```

> [!WARNING]
> The Build Card is available only in Japanese.

### Getting Character Data
```js
const { Character } = require("starrail-manager");

const char = new Character({lang: "jp"});
const charData = char.getCharBase(1001);
console.log(charData.name);

// result
// 三月なのか
```

### Getting Light Cone Data
```js
const { LightCone } = require("starrail-manager");

const light_cone = new LightCone({lang: "jp"});
const data = light_cone.getData(22001);
console.log(data.name);

// result
// よぉ、ここにいるぜ
```

# API and Data
## API
This package uses the `MiHoMo API`.\
**[MiHoMo API](https://march7th.xyz/en/)**

## Data
Character Data, Light Cone Data, and other data are retrieved using `StarRailRes`\
**[StarRailRes](https://github.com/Mar-7th/StarRailRes)**\
The Weight Data used for score calculation references `StarRailScore`\
**[StarRailScore](https://github.com/Mar-7th/StarRailScore)**
