"use strict";

let Vec3 = require('vektor').vector;
let _ = require('lodash');

let Octree = require('./src/octree');
let OctreePoint = require('./src/octreePoint');

let system = new Octree({
  root: true,
  center: new Vec3(0, 0, 0),
  halfDimension: 9000000000 // 9 billion km, the heliopause
});

_.times(1000, (i) => {
  _.times(100, (j) => {
  let point = new OctreePoint(new Vec3(Math.random() * 16000000000 - 8000000000,
                                       Math.random() * 16000000000 - 8000000000, 
                                       Math.random() * 16000000000 - 8000000000                                      
                                      ), 1);
  system.insert(point);
  });
  console.log("iteration:", i, "depth:",system.depth(), "memory:", process.memoryUsage());
});
