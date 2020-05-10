/*
Derived from Daniel Shiffman's Quadtree and Worley videos.

I recommend putting parts around 10-20 if you are going to turn on loops
density * sector^2 = total points
View range is derived from sector - smaller sector # = larger views = more homogenous

*/

let qtree;
let part = 4; // pixel size (should be smaller than sector or density)
let density = 15; // per sector
let sector = 4; //divides width or height (grows as a square)

// derived variables to reduce operations
let scalar = 0; // width divided by sector ^ 2
let unit = 0; // pixels per sector
let wp = 0; // width divided by part
let hp = 0; // height divided by part

let x = 0;
let y = 0;

let range;

function setup() {
  createCanvas(800, 800);
  background(255);
  let boundary = new Rectangle(0, 0, 800, 800);
  qtree = new QuadTree(boundary, 4);
  for (let i = 0; i <= sector; i++) {
    let sX = i * sector;
    scalar = width / sq(sector);
    unit = scalar * sector / part;
    for (let j = 0; j <= sector; j++) {
      let sY = j * sector;
      for (let k = 0; k < density; k++) {
        let p = new Point(random(sq(sector) * scalar) + sX,
          random(sq(sector) * scalar) + sY);
        qtree.insert(p);
      }
    }
  }
  console.log(sector, ' divisions, ', sector * scalar, 'vision square, ', part, 'pixel size.', density * sq(sector), ' Total points');
  wp = width / part;
  hp = height / part;
  background(0);
  noStroke();
}

function draw() {
  range = new Rectangle(0, 0, sector * scalar, sector * scalar);
  for (let i = 0; i < wp * hp; i++) {
    if (x >= width) {
      x = 0;
      if (y >= height) {
        y = 0;
      } else {
        y += part;
      }
    } else {
      x += part;
    }
    range.x = x;
    range.y = y;
    rectMode(CENTER);
    if (x < width && y < height) {
      let points = qtree.query(range);
      let distances = [];
      let tar = createVector(0, 0);
      for (let p in points) {
        let d = dist(x, y, points[p].x, points[p].y)
        distances[p] = d;
      }
      let sorted = sort(distances);
      let r = map(sorted[0], 0, scalar * sector, 250, 0);
      let g = map(sorted[1], 0, scalar * sector, 250, 0);
      let b = map(sorted[2], 0, scalar * sector, 0, 255);
      fill(r, g, b);
      if (typeof distances[0] === 'undefined') fill(0);
      rect(x, y, part, part);
    }
  }
  noLoop();
  // qtree.show();
}