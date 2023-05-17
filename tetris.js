const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const tileColumn = 10;
const tileRow = 20;
const tileWidth = 25;
const tileHeight = 25;
const tilePadding = 3;
const tileOffsetTop = 580 - ((tileHeight*tileRow)+(tilePadding*tileRow));
const tileOffsetLeft = 600 - (((tileColumn/2)*tileWidth)+(((tileColumn/2)-1)*tilePadding));
let leftPressed = false;
let rightPressed = false;
let positionY = 0;
let positionX = 3;
let bottomRow = 3;
let rightColumn = 3;
let score = 0;

let shapes = [
  [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1]//yellow
  ],
  [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [2]//orange
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [3]//blue
  ],
  [
    [1, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [4]//purple
  ],
  [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [5]//red
  ],
  [
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [6]//green
  ],
  [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [7]//cyan
  ]
  ]

//keyHandler
document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e){
  if(e.key == "Left" || e.key == "ArrowLeft" || e.key == "a"){
    moveH(-1);
  }
  else if(e.key == "Right" || e.key == "ArrowRight" || e.key == "d"){
    moveH(1);
  }
  else if(e.key == "Down" || e.key == "ArrowDown" || e.key == "s"){
    moveV(1);
  }
  else if(e.key == "Up" || e.key == "ArrowUp" || e.key == "w"){
    rotateShape("cw");
  }
  else if(e.key == "z" || e.key == "Z"){
    rotateShape("ccw");
  }
}

//moves the horizontal position of the shape
function moveH(distance){
  if(((distance < 0 && positionX != 0)&&!checkLeft()) ||
    ((distance > 0 && positionX+rightColumn != tileColumn-1)&&!checkRight())){
    positionX += distance;
    draw();
  }
}

//moves the vertical position of the shape
function moveV(distance){
  if(((positionY+bottomRow < tileRow)&&(positionY != 0))&&!checkBottom()){
    positionY += distance;
    draw();
  }
}

//rotates the shape in the direction of the given parameter
function rotateShape(direction){
  if(direction == "cw"){
    let tShape = rotateShapeCW(tempShape);
    let tBottomRow = findBottom(tShape);
    let tRightColumn = findRight(tShape);
    //check if rotate crosses boundary
    if((positionX+tRightColumn+1 > tileColumn) || (positionY+tBottomRow+1 > tileRow)){
      console.log("cannot rotate, exceeds boundary");
      return;
    }
    //check if block is in the way
    for(let i = 0; i < tBottomRow+1; i++){
      for(let e = 0; e < tRightColumn+1; e++){
        if(tShape[i][e] == 1 && tile[positionX+e][positionY+i].tcolor == "#00FF00"){
          console.log("cannot rotate, block in the way");
          return;
        }
      }
    }
    tempShape = tShape;
    findSides(tempShape);
    draw();
    console.log("rotated cw");
  }
  else if(direction == "ccw"){
    let tShape = rotateShapeCCW(tempShape);
    let leftColumn = findLeft(tShape);
    let topRow = findTop(tShape);
    let tBottomRow = findBottom(tShape);
    let tRightColumn = findRight(tShape);
    if(((positionX+(tRightColumn-leftColumn)) < tileColumn) && ((positionY+(tBottomRow-topRow)) < tileRow)){
        tempShape = tShape;
        findSides(tempShape);
        draw();
        console.log("rotated ccw");
        return;
    }
    else{
        console.log("cannot rotate, exceeds boundary");
        return;
    }
  }
}

//creates the tiles for the grid
let tile = [];
for (let i = 0; i < tileColumn; i++) {
  tile[i] = [];
  for (let e = 0; e < tileRow; e++) {
    tile[i][e] = {x: 0, y: 0, tcolor: "#000000"};
  }
}

//draws the grid
function drawGrid(){
  for(let i = 0; i < tileColumn; i++){
    for(let e = 0; e < tileRow; e++){
      const tileX = (i * (tileWidth + tilePadding)) + tileOffsetLeft;
      const tileY = (e * (tileHeight + tilePadding)) + tileOffsetTop;
      tile[i][e].x = tileX;
      tile[i][e].y = tileY;
      ctx.beginPath();
      ctx.rect(tileX, tileY, tileWidth, tileHeight);
      ctx.fillStyle = tile[i][e].tcolor;
      ctx.fill();
      ctx.closePath();
    }
  }
}

//im a genius
let tempShape = [];

//draws the shape on the screen
function drawShape(object){
  let shape = object;
  for(let i = 0; i < 4; i++){
    for(let e = 0; e < 4; e++){
      if(shape[e][i] == 1){
        ctx.beginPath();
        ctx.rect(tile[i+positionX][e+positionY].x, tile[i+positionX][e+positionY].y, tileWidth, tileHeight);
        ctx.fillStyle = "#FF0000"
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//turns the shape 90 degrees
function rotateShapeCW(shape){
  let rShape = [];
  for(let j = 0; j < 4; j++){
    rShape[j] = [];
    for(let k = 0; k < 4; k++){
      rShape[j][k] = shape[j][k];
    }
  }
  rShape = rShape.map((val, index) => rShape.map(row => row[index]).reverse());
  
  let leftColumn = findLeft(rShape);
  let topRow = findTop(rShape);
  let tBottomRow = findBottom(rShape);
  let tRightColumn = findRight(rShape);
  let tnum = 0;
  //shifts the shape back to the top left of the grid
  if((leftColumn != 0)){
    for(let i = topRow; i < tBottomRow+1; i++){
      for(let e = leftColumn; e < tRightColumn+1; e++){
        if(rShape[i][e] == 1){
          tnum = rShape[i][e];
          rShape[i-topRow][e-leftColumn] = tnum;
          rShape[i][e] = 0;
        }
      }
    }
  }
  
  return rShape;
}

//turns the shape -90 degrees
function rotateShapeCCW(shape){
  let rShape = [];
  for(let j = 0; j < 4; j++){
    rShape[j] = [];
    for(let k = 0; k < 4; k++){
      rShape[j][k] = shape[j][k];
    }
  }
  rShape = rShape[0].map((val, index) => rShape.map(row => row[row.length-1-index]));

  let leftColumn = findLeft(rShape);
  let topRow = findTop(rShape);
  let tBottomRow = findBottom(rShape);
  let tRightColumn = findRight(rShape);
  let tnum = 0;
  //shifts the shape back to the top left of the grid
  if((leftColumn != 0)){
    for(let i = topRow; i < tBottomRow+1; i++){
      for(let e = leftColumn; e < tRightColumn+1; e++){
        if(rShape[i][e] == 1){
          tnum = rShape[i][e];
          rShape[i-topRow][e-leftColumn] = tnum;
          rShape[i][e] = 0;
        }
      }
    }
  } 
  return rShape;
}

//checks if there is a block pr floor below
function checkBottom(){
  if((positionY+bottomRow+1) > tileRow-1){
    return true;
  }
  for(let i = 0; i < bottomRow+1; i++){
    for(let e = 0; e < rightColumn+1; e++){
      if((tile[positionX+e][positionY+i+1].tcolor != "#000000")&&(tempShape[i][e] == 1)){
        return true;
      }
    }
  }
  return false;
}

//checks if there is a block left of the shape
function checkLeft(){
  for(let i = 0; i < bottomRow+1; i++){
    if((tile[positionX-1][positionY+i].tcolor != "#000000")&&(tempShape[i][0] == 1)){
      return true;
    }
  }
  return false;
}

//checks of there is a block right of the shape
function checkRight(){
  for(let i = 0; i < bottomRow+1; i++){
    if((tile[positionX+rightColumn+1][positionY+i].tcolor != "#000000")&&(tempShape[i][rightColumn] == 1)){
      return true;
    }
  }
  return false;
}

//finds the bottom row the shape
function findBottom(object){
  let rowAmount = 0;
  let tBottomRow;
  for(let i = 0; i < 4; i++){
    for(let e = 0; e < 4; e++){
      rowAmount += object[i][e];
    }
    if(rowAmount > 0){
      tBottomRow = i;
    }
    rowAmount = 0;
  }
  return tBottomRow;
}

//Finds the index of the rightmost column of the shape
function findRight(object){
  let columnAmount = 0;
  let tRightColumn = 0;
  for(let i = 0; i < 4; i++){
    for(let e = 0; e < 4; e++){
      columnAmount += object[e][i];
    }
    if(columnAmount > 0){
      tRightColumn = i;
    }
    columnAmount = 0;
  }
  return tRightColumn;
}

//Finds the index of the leftmost column of the shape
function findLeft(object){
  let columnAmount = 0;
  for(let i = 0; i < 4; i++){
    for(let e = 0; e < 4; e++){
      columnAmount += object[e][i];
    }
    if(columnAmount > 0){
      return i;
    }
  }
}

//Finds the index of the topmost row of the shape
function findTop(object){
  let rowAmount = 0; 
  for(let i = 0; i < 4; i++){
    for(let e = 0; e < 4; e++){
      rowAmount += object[i][e];
    }
    if(rowAmount > 0){
      return i;
    }
  }
}

//Finds the right and left boundaries of the shape
function findSides(shape){
  bottomRow = findBottom(shape);
  rightColumn = findRight(shape);
}

//reset shape to start position
function reset(){
  for(let i = 0; i < 4; i++){
    for(let e = 0; e < 4; e++){
      if(tempShape[e][i] == 1){
        tile[i+positionX][e+positionY].tcolor = "#00FF00";
      }
    }
  }  
  positionY = 0;
  positionX = (tileColumn/2) - 1;
  tempShape = shapes[Math.round((Math.random()*6))];
  findSides(tempShape);
}

//clears the board and draws the next shape
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawShape(tempShape);
}

//checks if the the bottom row of the grid is filled
function checkFilled(index){
  let rowAmount = 0;
  for(let i = 0; i < tileColumn; i++){
    if(tile[i][index].tcolor != "#000000"){
      rowAmount++;
    }
  }
  return (rowAmount === tileColumn);
}

function checkAndReplace(){
  let counter = 0;
  for(let i = tileRow-1; i >= 0; i--){
    if(checkFilled(i)){
      for(let e = 0; e < tileColumn; e++){
        tile[e][i].tcolor = "#000000";
      }
      counter++;
      for(let j = i-1; j > 0; j--){
        for(let k = 0; k < tileColumn; k++){
          if(tile[k][j].tcolor != "#000000"){
            tile[k][j+1].tcolor = tile[k][j].tcolor;
            tile[k][j].tcolor = "#000000";
          }
        }
      }
    }
  }
  return counter;
}

//Updates the function by redrawing the shape and moving the shape down 
function update(){
  draw();
  //Deletes bottom row and shifts all blocks down to replace deleted blocks
  score += 1000*checkAndReplace(); 
  //Checks if it will hit another block or the ground
  checkBottom() ? reset() : positionY++;
}

tempShape = shapes[Math.round((Math.random()*6))];
findSides(tempShape);
drawGrid();
const interval = setInterval(update, 1000);