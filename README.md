# StarRail Manager

##### English | [日本語](./doc/jp/README.md)

## Overview
The StarRail Manager is a Node.js wrapper for the MiHoMo API and StarRail Data used in Honkai: StarRail.\
**This is not an official Honkai: StarRail project.**

## Install

```
$ npm install starrail-manager
```

## Clone
To use this package, you need to clone two repositories.

1. [StarRailScore](https://github.com/Mar-7th/StarRailScore)
```
$ git clone https://github.com/Mar-7th/StarRailScore.git
```

2. [StarRailRes](https://github.com/Mar-7th/StarRailRes)
```
$ git clone https://github.com/Mar-7th/StarRailRes.git
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
client.getCharData(830647229, 0).then((data) => {
  client.createBuildCard(data).then((canvas) => {
    fs.writeFileSync("output.png", canvas.toBuffer());
  })
})
```

#### ⚠️ **Warning**
**The Build Card is available only in Japanese.**

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


You can see the changelog [here](./doc/changelog/changelog.md)\
You can see the document [here](https://shicoku.github.io/StarRail-Manager-docs/)