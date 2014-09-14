  	  

  	  $(document).ready(function(){

        var rows = 3, cols = 4 , totalRows = 2 * rows + 1;
        var thtml = "";
        var ind = -1;

        var score = {
        	blue : rows * cols,
        	red : rows * cols
        }


        var board = Array();
        var nextMove;
        var selectedCell = {
        	row:0,
        	col:0,
        	id:-1,
        	type:-2
        }
        var cell = {
        	row:0,
        	col:0,
        	id:-1,
        	type:-2
        }
        var turn = 1;
        

			//$('body').append('<div id = "boardcontainer"></div>');
			for(i=0;i<totalRows;i++){
				thtml = thtml + "<div class=\"row\">";
				for(j=0;j<cols;j++){
					thtml = thtml + '<div class = "boardtile tileP ';
					if(i < rows){
                        thtml = thtml +'btile';
                        board[++ind] = -1;
					}
					else if (i == rows){
                        thtml = thtml +'wtile';
                        board[++ind] = 0;
					}
					else{
                        thtml = thtml +'rtile';
                        board[++ind] = 1;
					}
					thtml = thtml+'" data-row="'+i+'" data-col="'+j+'" id="'+ind+'"></div>';
				}
				thtml = thtml + "</div>";
			}
            $('#boardcontainer').append(thtml);
            /*$('body').append('<div id= "info"><div id = "turn"></div>'+
				'<div id = "score"></div>'+
				'<div id = "uiconsole"></div>'+
			'</div>');*/


			toggleTurn();


            
			$('.boardtile').click(function(){
		  	  	//console.log("hii"+$(this).data("row"));

		  	  	//get selected cell
		  	  	makeCell($(this).data("row"),$(this).data("col"),$(this).attr("id"),board[$(this).attr("id")]);

		  	  	//console.log(cell);

		  	  	if(cell.type == 0){
		  	  		if(turn == selectedCell.type){
		  	  			moveRes = moveResult(cell,selectedCell);
		  	  			console.log(moveRes);
		  	  			if(moveRes == "moveSingleCell"){
		  	  				var tclass = tileClass(selectedCell);
		  	  				$('#'+selectedCell.id).removeClass(tclass);
		  	  				$('#'+cell.id).removeClass("wtile");
		  	  				$('#'+selectedCell.id).addClass("wtile");
		  	  				$('#'+cell.id).addClass(tclass);
		  	  				board[cell.id] = selectedCell.type;
		  	  				board[selectedCell.id] = 0;

		  	  				toggleTurn();
		  	  			}
		  	  			else if(moveRes == "point"){
		  	  				var tRow = (selectedCell.row + cell.row)/2;
		  	  				var tCol = (selectedCell.col + cell.col)/2;
		  	  				var tid = getId(tRow,tCol);
		  	  				var tclass = tileClassFromId(tid);

		  	  				if(board[tid] == -1){
		  	  					score.blue--;
		  	  				}
		  	  				else if(board[tid] ==1){
		  	  					score.red--;
		  	  				}

		  	  				//delete the cell in between 
		  	  				board[tid] = 0;
		  	  				$('#'+tid).removeClass(tclass);
		  	  				$('#'+tid).addClass("wtile");

		  	  				//switch cells

		  	  				tclass = tileClass(selectedCell);
		  	  				$('#'+selectedCell.id).removeClass(tclass);
		  	  				$('#'+cell.id).removeClass("wtile");
		  	  				$('#'+selectedCell.id).addClass("wtile");
		  	  				$('#'+cell.id).addClass(tclass);
		  	  				board[cell.id] = selectedCell.type;
		  	  				board[selectedCell.id] = 0;

		  	  				toggleTurn();
		  	  			}
		  	  		}
                    
		  	  	}
		  	  	else if(cell.type == selectedCell.type){		  	  		
		  	  		if(cell.id == selectedCell.id){
		  	  			//de-select current selection
		  	  			$(this).removeClass("tileSelected");
		  	  		    $(this).addClass("tileP");
		  	  		    console.log("same cell");
		  	  			resetSelectedCell();
		  	  		}
		  	  		else{
		  	  			$('#'+selectedCell.id).removeClass("tileSelected").addClass("tileP");
		  	  			$(this).removeClass("tileP");
		  	  			$(this).addClass("tileSelected");
		  	  			selectCell(cell);
		  	  		}
		  	  		
		  	  	}else{
		  	  		$('#'+selectedCell.id).removeClass("tileP")
		  	  		selectCell(cell);
		  	  		$(this).addClass("tileSelected");
		  	  	}
		  	  	
		  	  	//console.log(selectedCell);
		  	});



		  	function resetSelectedCell(){
		  		selectedCell.row = -1;
		  		selectedCell.col = -1;
		  		selectedCell.id = -1;
		  		selectedCell.type = -2;
		  		$('#'+selectedCell.id).removeClass("tileSelected");
		  		$('#'+selectedCell.id).addClass("tileP");
		  	}

		  	function moveResult(cell1,cell2){
		  		var res;
		  		
		  		/*console.log(cell1);
		  		console.log(cell2);
		  		console.log(turn);
		  		console.log(getId((cell1.row + cell2.row)/2,cell1.col)+" "+board[getId((cell1.row + cell2.row)/2,cell1.col)]);
		  		console.log(board);
		  		*/

                 if((cell1.row == cell2.row )&&( Math.abs(cell1.col - cell2.col) == 1)){
                 	res = "moveSingleCell";
                 	console.log("mr-1");
                 }
                 else if( (cell1.col == cell2.col) && (Math.abs(cell1.row-cell2.row) == 1) ){
                    res = "moveSingleCell";
                    console.log("mr-2");
                 }
                 else if((cell1.row == cell2.row )&&( Math.abs(cell1.col - cell2.col) == 2) && (board[getId(cell1.row,(cell1.col + cell2.col)/2)] == turn*-1 )){
                 	res = "point";
                 	console.log("mr-3");
                 }
                 else if((cell1.col == cell2.col )&&( Math.abs(cell1.row - cell2.row) == 2) && (board[getId((cell1.row + cell2.row)/2,cell1.col)] == turn*-1) ){
                 	res = "point";
                 	console.log("mr-4"+turn+" "+board[$('#'+(cell1.row + cell2.row)/2).attr('id')]);
                 }
                 else{
                 	console.log("other");
                 	p("Invalid move");
                 	res = "other";
                 }
                 return res;
		  	}

		  	function getId(r,c){
		  		return r*cols + c;
		  	}

		  	function selectCell(cell){
		  		selectedCell.row = cell.row;
		  		selectedCell.col = cell.col;
		  		selectedCell.id = cell.id;
		  		selectedCell.type = cell.type;
		  	}

		  	function makeCell(x,y,id,type){
		  		cell.row = parseInt(x);
		  		cell.col = parseInt(y);
		  		cell.id = parseInt(id);
		  		cell.type = parseInt(type);
		  	}

		  	function toggleTurn(){
		  		turn = turn * -1;
		  		resetSelectedCell();

		  		if(score.blue == 0){
		  			$('#boardcontainer').html("GameOVer<br> Won by Red");
		  		}
		  		else if(score.red == 0){
		  			$('#boardcontainer').html("GameOVer<br> Won by blue");
		  		}

		  		if(turn == -1){
		  			$('#turn').html('<p style="color:blue">Blue</p>');
		  		}
		  		else{
		  			$('#turn').html('<p style="color:red">Red</p>');
		  		}

		  		$('#score').html('<div class="scorewrapper"><p class="bscore">'+score.blue+'</p></div>'+'<div class="scorewrapper"><p class="rscore">'+score.red+'</p></div>');
		  		for(var k=0; k < totalRows*cols;++k){
		  			if($('#'+k).hasClass("tileSelected")){
		  				$('#'+k).removeClass('tileSelected');
		  				$('#'+k).addClass('tileP');
		  			}
		  		}
		  	}

		  	function toRow(ti){
		  		return Math.floor(ti/cols);
		  	}

		  	function toCol(ti){
		  		return ti%cols
		  	}

		  	function p(str){
		  		$('#uiconsole').html(str);
		  	}

		  	function tileClass(c){
		  		if(c.type == -1){
		  			return "btile";
		  		}
		  		else{
		  			return "rtile";
		  		}
		  	}

		  	function tileClassFromId(id){
		  		if(board[id] == -1){
		  			return "btile";
		  		}
		  		else if(board[id] == 1){
		  			return "rtile";
		  		}
		  		else{
		  			return "wtile";
		  		}
		  	}

		});