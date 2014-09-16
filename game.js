 function initVars() {
     thtml = "";
     var ind = -1;

     score = {
         blue: rows * cols,
         red: rows * cols
     }

     selectedCell = {
         row: 0,
         col: 0,
         id: -1,
         type: -2
     }
     cell = {
         row: 0,
         col: 0,
         id: -1,
         type: -2
     }
     turn = 1;
 }

 function setup() {
 	$('#bdy').html("");
     $('#bdy').append('<div id = "info">' + '<div id = "turn"></div>' + '<div id = "score"></div>' + '</div>'+'<div id="boardcontainer"></div>' );
 }

 function initBoard() {
 	thtml = "";
 	ind = -1;
     for (i = 0; i < totalRows; i++) {
         thtml = thtml + "<div class=\"row\">";
         for (j = 0; j < cols; j++) {
             thtml = thtml + '<div class = "boardtile tileP ';
             if (i < rows) {
                 thtml = thtml + 'btile';
                 board[++ind] = -1;
             } else if (i == rows) {
                 thtml = thtml + 'wtile';
                 board[++ind] = 0;
             } else {
                 thtml = thtml + 'rtile';
                 board[++ind] = 1;
             }
             thtml = thtml + '" data-row="' + i + '" data-col="' + j + '" id="' + ind + '"></div>';
         }
         thtml = thtml + "</div>";
     }
     $('#boardcontainer').append(thtml);

 }


 function beginGame() {
     initVars();
     setup();
     initBoard();
     listenClicks();
     toggleTurn();
 }

 function moveToAdjCell() {
     var tclass = tileClass(selectedCell);
     $('#' + selectedCell.id).removeClass(tclass);
     $('#' + cell.id).removeClass("wtile");
     $('#' + selectedCell.id).addClass("wtile");
     $('#' + cell.id).addClass(tclass);
     board[cell.id] = selectedCell.type;
     board[selectedCell.id] = 0;
 }

 function jumbToCell() {
     var tRow = (selectedCell.row + cell.row) / 2;
     var tCol = (selectedCell.col + cell.col) / 2;
     var tid = getId(tRow, tCol);
     var tclass = tileClassFromId(tid);

     if (board[tid] == -1) {
         score.blue--;
     } else if (board[tid] == 1) {
         score.red--;
     }

     //delete the cell in between 
     board[tid] = 0;
     $('#' + tid).removeClass(tclass);
     $('#' + tid).addClass("wtile");

     //switch cells
     tclass = tileClass(selectedCell);
     $('#' + selectedCell.id).removeClass(tclass);
     $('#' + cell.id).removeClass("wtile");
     $('#' + selectedCell.id).addClass("wtile");
     $('#' + cell.id).addClass(tclass);
     board[cell.id] = selectedCell.type;
     board[selectedCell.id] = 0;
 }


 function listenClicks() {

 	
     $('.boardtile').click(function () {
         var tturn = false;
     	//console.log("click");
         makeCell($(this).data("row"), $(this).data("col"), $(this).attr("id"), board[$(this).attr("id")]);
         if (cell.type == 0) {
             if (turn == selectedCell.type) {
                 moveRes = moveResult(cell, selectedCell);
                 console.log(moveRes);
                 if (moveRes == "moveSingleCell") {
                     moveToAdjCell();
                     tturn = true;
                     //toggleTurn();
                 } else if (moveRes == "point") {
                     jumbToCell();
                     tturn = true;
                     //toggleTurn();
                 }
             }

         } else if (cell.type == selectedCell.type) {
             if (cell.id == selectedCell.id) {
                 //de-select current selection
                 $(this).removeClass("tileSelected");
                 $(this).addClass("tileP");
                 console.log("same cell");
                 resetSelectedCell();
             } else {
                 $('#' + selectedCell.id).removeClass("tileSelected").addClass("tileP");
                 $(this).removeClass("tileP");
                 $(this).addClass("tileSelected");
                 selectCell(cell);
             }

         } else {
             $('#' + selectedCell.id).removeClass("tileP")
             selectCell(cell);
             $(this).addClass("tileSelected");
         }

         if(tturn){
         	toggleTurn();
         }

         //console.log(selectedCell);
     });

 }

 function resetSelectedCell() {
     selectedCell.row = -1;
     selectedCell.col = -1;
     selectedCell.id = -1;
     selectedCell.type = -2;
     $('#' + selectedCell.id).removeClass("tileSelected");
     $('#' + selectedCell.id).addClass("tileP");
 }

 function moveResult(cell1, cell2) {
     var res;

/*console.log(cell1);
		  		console.log(cell2);
		  		console.log(turn);
		  		console.log(getId((cell1.row + cell2.row)/2,cell1.col)+" "+board[getId((cell1.row + cell2.row)/2,cell1.col)]);
		  		console.log(board);
		  		*/

     if ((cell1.row == cell2.row) && (Math.abs(cell1.col - cell2.col) == 1)) {
         res = "moveSingleCell";
         //console.log("mr-1");
     } else if ((cell1.col == cell2.col) && (Math.abs(cell1.row - cell2.row) == 1)) {
         res = "moveSingleCell";
         //console.log("mr-2");
     } else if ((cell1.row == cell2.row) && (Math.abs(cell1.col - cell2.col) == 2) && (board[getId(cell1.row, (cell1.col + cell2.col) / 2)] == turn * -1)) {
         res = "point";
         //console.log("mr-3");
     } else if ((cell1.col == cell2.col) && (Math.abs(cell1.row - cell2.row) == 2) && (board[getId((cell1.row + cell2.row) / 2, cell1.col)] == turn * -1)) {
         res = "point";
         //console.log("mr-4" + turn + " " + board[$('#' + (cell1.row + cell2.row) / 2).attr('id')]);
     } else {
         console.log("other");
         p("Invalid move");
         res = "other";
     }
     return res;
 }

 function getId(r, c) {
     return r * cols + c;
 }

 function selectCell(cell) {
     selectedCell.row = cell.row;
     selectedCell.col = cell.col;
     selectedCell.id = cell.id;
     selectedCell.type = cell.type;
 }

 function makeCell(x, y, id, type) {
     cell.row = parseInt(x);
     cell.col = parseInt(y);
     cell.id = parseInt(id);
     cell.type = parseInt(type);
 }

 function toggleTurn() {
     turn = turn * -1;
     resetSelectedCell();

     if (score.blue == 0) {
         $('#boardcontainer').html("Game Over<br> Won by Red<br><div id=\"restart\">Restart</div>");
          $('#restart').click(function(){
	 	 	beginGame();
	     });
     } else if (score.red == 0) {
         $('#boardcontainer').html("Game Over<br> Won by blue<br><div id=\"restart\">Restart</div>");
          $('#restart').click(function(){
	 	 	beginGame();
	     });
     }

     if (turn == -1) {
         $('#turn').html('<p style="color:blue">Blue</p>');
     } else {
         $('#turn').html('<p style="color:red">Red</p>');
     }

     $('#score').html('<span class="scorewrapper bscore">' + score.blue + '</span>' + '<span class="scorewrapper rscore">' + score.red + '</span>');
     for (var k = 0; k < totalRows * cols; ++k) {
         if ($('#' + k).hasClass("tileSelected")) {
             $('#' + k).removeClass('tileSelected');
             $('#' + k).addClass('tileP');
         }
     }

     console.log(board);

    if(turn == comp && playAi){
    	p("Waiting for comp");
    	setTimeout(aiplay,2000);
     	//aiplay();
     }
     else{
     	p("Your Turn");
     }
 }

 function aiplay(){
 	var mv = getNextMove();
 	console.log(mv);
 	sleep(1000);
 	$('#'+mv.from).click();
 	sleep(1000);
 	$('#'+mv.to).click();
 }

 function getNextMove(){
 	var boption = {
 		from:-1,
 		to:-1
 	}
 	for(var ai = 0; ai < totalRows * cols; ++ai){
 		if(board[ai] == comp){

 			cc = canCutSomething(ai);
 			mc = moveToAdjCellPossible(ai);

 			if(cc!= -1){
 				boption.from = ai;
 				boption.to = cc;
 				break;
 			}
 			else if(mc !=-1){
 				boption.from = ai;
 				boption.to = mc;
 			}
 		}
 	}
 	return boption;
 }

 function canCutSomething(v){
    if(canCutLeft(v)){
    	return v-2;
    }
    if(canCutRight(v)){
    	return v+2;
    }
    if(canCutUp(v)){
    	return v-2*cols;
    }
    if(canCutDown(v)){
    	return v+2*cols
    }
    return -1;
 }

 function canCutLeft(v){
 	if(toCol(v) < 2){
 		return false;
 	}

 	if((board[v-1] == -1 * board[v]) && (canMoveLeft(v-1))){
 		return true;
 	}
 	return false;
 }

 function canCutRight(v){
 	if(toCol(v) > cols-3){
 		return false;
 	}
 	if((board[v+1] == -1* board[v]) && (canMoveRight(v+1))){
 		return true;
 	}
 	return false;
 }

 function canCutUp(v){
 	if(toRow(v) < 2){
 		return false;
 	}
 	if((board[v-cols] == -1 * board[v]) && (canMoveUp(v-cols))){
 		return true;
 	}
 	return false;
 }

 function canCutDown(v){
 	if(toRow(v) > totalRows-3){
 		return false;
 	}
 	if((board[v+cols] == -1*board[v]) && (canMoveDown(v+cols))){
 		return true;
 	}
 	return false;
 }

 function moveToAdjCellPossible(v){
     if(canMoveLeft(v)){
     	return v-1;
     }

     if(canMoveRight(v)){
     	return v+1;
     }

     if(canMoveUp(v)){
     	return v-cols;
     }

     if(canMoveDown(v)){
     	return v+cols;
     }

     return -1;
 }

 function canMoveLeft(v){
 	if(v%cols == 0){
 		return false;
 	}

 	if(board[v-1] != 0){
 		return false;
 	}
 	return true;
 }

 function canMoveRight(v){
 	if((v+1)%cols == 0){
 		return false;
 	}
 	if(board[v+1] !=0 ){
 		return false;
 	}
 	return true;
 }

 function canMoveUp(v){
 	if(v < cols){
 		return false;
 	}
 	if(board[v-cols] !=0){
 		return false;
 	}
 	return true;
 }

 function canMoveDown(v){
 	if(v > cols * (totalRows-2)){
 		return false;
 	}
 	if(board[v+cols] != 0){
 		return false;
 	}
 	return true;
 }

 function toRow(ti) {
     return Math.floor(ti / cols);
 }

 function toCol(ti) {
     return ti % cols
 }

 function p(str) {
     $('#uiconsole').html(str);
 }

 function tileClass(c) {
     if (c.type == -1) {
         return "btile";
     } else {
         return "rtile";
     }
 }

 function tileClassFromId(id) {
     if (board[id] == -1) {
         return "btile";
     } else if (board[id] == 1) {
         return "rtile";
     } else {
         return "wtile";
     }
 }

 function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}