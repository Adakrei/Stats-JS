# Stats-JS
[![NPM](https://img.shields.io/npm/v/@adakrei/stats.svg)](https://www.npmjs.com/package/@adakrei/stats)  
JS/TS Performance Monitor

## Installation
```bash
pnpm i @adakrei/stats
```

## Demo
[Basic](https://adakrei.github.io/Stats-JS/examples/basic.html)  
[Custom](https://adakrei.github.io/Stats-JS/examples/custom.html)  
[Stress](https://adakrei.github.io/Stats-JS/examples/stress.html)  

## Usage
Here is a simple example to use Stats-JS

#### UMD
```html
<script src="../dist/stats.min.js"></script>
<script>
let stats = new statsjs.Stats();
stats.showPanel(1);
document.body.appendChild(stats.dom);

let canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);

let context = canvas.getContext('2d');
context.fillStyle = 'rgba(127,0,255,0.05)';

function animate() {
    let time = performance.now() / 1000;
    context.clearRect(0, 0, 512, 512);
    stats.begin();
    for (let i = 0; i < 2000; i++) {
        let x = Math.cos(time + i * 0.01) * 196 + 256;
        let y = Math.sin(time + i * 0.01234) * 196 + 256;

        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2, true);
        context.fill();
    }
    stats.end();
    requestAnimationFrame(animate);
}

animate();
</script>
```

#### ES Module
```ts
import { Stats } from '@adakrei/stats';

let stats = new Stats();
stats.showPanel(1);
//...
```
