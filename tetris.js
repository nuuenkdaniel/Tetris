var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var tileColumn = 10;
    var tileRow = 20;
    var tileWidth = 25;
    var tileHeight = 25;
    var tilePadding = 3;
    var tileOffsetTop = 580 - ((tileHeight*tileRow)+(tilePadding*tileRow));
    var tileOffsetLeft = 600 - (((tileColumn/2)*tileWidth)+(((tileColumn/2)-1)*tilePadding));
    var leftPressed = false;
    var rightPressed = false;
    var positionY = 0;
    var positionX = 3;
    var bottomRow = 3;
    var rightColumn = 3;
    var score = 0;

    var shapes = [
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
      if((distance < 0 && positionX != 0)&&(checkLeft() == false)){
        positionX += distance;
        draw();
      }
      else if((distance > 0 && positionX+rightColumn != tileColumn-1)&&(checkRight() == false)){
        positionX += distance;
        draw();
      }
    }
    
    //moves the vertical position of the shape
    function moveV(distance){
      if(((positionY+bottomRow < tileRow)&&(positionY != 0))&&(checkBottom() == false)){
        positionY += distance;
        draw();
      }
    }

    //rotates the shape in the direction of the given parameter
    function rotateShape(direction){
      if(direction == "cw"){
        let tShape = rotateShapeCW(tempShape);
        let leftColumn = findLeft(tShape);
        let topRow = findTop(tShape);
        let tBottomRow = findBottom(tShape);
        let tRightColumn = findRight(tShape);
        //check if rotate crosses boundary
        if((positionX+tRightColumn+1 > tileColumn) || (positionY+tBottomRow+1 > tileRow)){
          console.log("cannot rotate, exceeds boundary");
          return;
        }
        //check if block is in the way
        for(var i = 0; i < tBottomRow+1; i++){
          for(var e = 0; e < tRightColumn+1; e++){
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
    var tile = [];
    for (var i = 0; i < tileColumn; i++) {
      tile[i] = [];
      for (var e = 0; e < tileRow; e++) {
        tile[i][e] = {x: 0, y: 0, tcolor: "#000000"};
      }
    }

    //draws the grid
    function drawGrid(){
      for(var i = 0; i < tileColumn; i++){
        for(var e = 0; e < tileRow; e++){
          var tileX = (i * (tileWidth + tilePadding)) + tileOffsetLeft;
          var tileY = (e * (tileHeight + tilePadding)) + tileOffsetTop;
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
    var tempShape = [];

    //draws the shape on the screen
    function drawShape(object){
      shape = object;
      for(var i = 0; i < 4; i++){
        for(var e = 0; e < 4; e++){
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
      for(var i = 0; i < bottomRow+1; i++){
        for(var e = 0; e < rightColumn+1; e++){
          if((tile[positionX+e][positionY+i+1].tcolor != "#000000")&&(tempShape[i][e] == 1)){
            return true;
          }
        }
      }
      return false;
    }
    
    //checks if there is a block left of the shape
    function checkLeft(){
      for(var i = 0; i < bottomRow+1; i++){
        if((tile[positionX-1][positionY+i].tcolor != "#000000")&&(tempShape[i][0] == 1)){
          return true;
        }
      }
      return false;
    }
    
    //checks of there is a block right of the shape
    function checkRight(){
      for(var i = 0; i < bottomRow+1; i++){
        if((tile[positionX+rightColumn+1][positionY+i].tcolor != "#000000")&&(tempShape[i][rightColumn] == 1)){
          return true;
        }
      }
      return false;
    }
    
    //finds the bottom row the shape
    function findBottom(object){
      var rowAmount = 0;
      var tBottomRow;
      for(var i = 0; i < 4; i++){
        for(var e = 0; e < 4; e++){
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
      var columnAmount = 0;
      var tRightColumn = 0;
      for(var i = 0; i < 4; i++){
        for(var e = 0; e < 4; e++){
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
      var columnAmount = 0;
      for(var i = 0; i < 4; i++){
        for(var e = 0; e < 4; e++){
          columnAmount += object[e][i];
        }
        if(columnAmount > 0){
          return i;
        }
      }
    }

    //Finds the index of the topmost row of the shape
    function findTop(object){
      var rowAmount = 0; 
      for(var i = 0; i < 4; i++){
        for(var e = 0; e < 4; e++){
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
      for(var i = 0; i < 4; i++){
        for(var e = 0; e < 4; e++){
          if(tempShape[e][i] == 1){
            tile[i+positionX][e+positionY].tcolor = "#00FF00";
          }
        }
      }
      console.log("reset");
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
      var rowAmount = 0;
      for(var i = 0; i < tileColumn; i++){
        if(tile[i][index].tcolor != "#000000"){
          rowAmount++;
        }
      }
      if(rowAmount == tileColumn){
        return true;
      }
      return false;
    }

    function checkAndReplace(){
      var counter = 0;
      for(var i = tileRow-1; i >= 0; i--){
        if(checkFilled(i)){
          for(var e = 0; e < tileColumn; e++){
            tile[e][i].tcolor = "#000000";
          }
          counter++;
          for(var j = i-1; j > 0; j--){
            for(var k = 0; k < tileColumn; k++){
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
    //tile[3][5].tcolor = "#00FF00";
    //draw();
    var interval = setInterval(update, 1000);