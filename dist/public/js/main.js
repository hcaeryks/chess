let game = new Game("w");
const canvas = document.getElementById("board");
const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
const canvasTop = canvas.offsetTop + canvas.clientTop;
const ctx = canvas.getContext("2d");
const squareSize = canvas.offsetHeight/8;
const pieces = [new Image(), new Image(), new Image(), new Image(),  new Image(), new Image(),
                new Image(), new Image(), new Image(), new Image(), new Image(), new Image(),
                new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
const pieceImageNames = ["wR", "wN", "wB", "wQ", "wK", "wP", "bR", "bN", "bB", "bQ", "bK", "bP", "R_glow", "N_glow", "B_glow", "Q_glow", "K_glow", "P_glow", "K_red_glow"];
const pieceShortName = ["R", "N", "B", "Q", "K", "P", "r", "n", "b", "q", "k", "p"];
const totalPieceImages = pieces.length;
const circles = [new Image(), new Image()]

let down = false;
let x = canvas.width/2;
let y = canvas.height/2;
let selectedPieceName = " ";
let selectedPiece = [-1, -1];
let selectableSquares = [];

for(let i = 0; i < totalPieceImages; i++) pieces[i].src = "assets/"+pieceImageNames[i]+".svg";
circles[0].src = "assets/yellow.png";
circles[1].src = "assets/red.png";
const proms = pieces.map(im=>new Promise(res => im.onload=()=>res(im.width,im.height)))
Promise.all(proms).then(data=>{redraw(game.board)})

function drawBaseBoard() {
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
    let light = "rgba(240,217,181,0.8)";
    let dark = "rgba(180,140,100,0.8)";
    let color = true;
    for(let i = 0; i < 64; i++) {
        if(color) ctx.fillStyle = light;
        else ctx.fillStyle = dark;
        if(i!=7&&i!=15&&i!=23&&i!=31&&i!=39&&i!=47&&i!=55) color = !color;
        let x = i%8 * squareSize;
        let y = Math.floor(i/8) * squareSize;
        ctx.fillRect(x, y, squareSize, squareSize);
    }
}

function redrawPieces(board) {
    drawBaseBoard();
    for(let i = 0; i < 64; i++) {
        let x = i%8 * squareSize;
        let y = Math.floor(i/8) * squareSize;
        if(board[Math.floor(i/8)][i-((Math.floor(i/8))*8)] != ' ') ctx.drawImage(pieces[pieceShortName.indexOf(board[Math.floor(i/8)][i-((Math.floor(i/8))*8)])], x, y, squareSize, squareSize);
    }
}

function redraw(board) {
    redrawPieces(board);
    if(selectableSquares) {
        for(let i = 0; i < selectableSquares.length; i++) {
            ctx.drawImage(pieces[12 + pieceShortName.indexOf(game.board[selectedPiece[0]][selectedPiece[1]].toUpperCase())], selectedPiece[1]*squareSize, selectedPiece[0]*squareSize, squareSize, squareSize);
            if(game.board[selectableSquares[i][0]][selectableSquares[i][1]] == ' ') ctx.drawImage(circles[0], selectableSquares[i][1]*squareSize, selectableSquares[i][0]*squareSize, squareSize, squareSize);
            else ctx.drawImage(circles[1], selectableSquares[i][1]*squareSize, selectableSquares[i][0]*squareSize, squareSize, squareSize);
        }
    }
}

function getRelPos(e) {
    return [e.pageX - canvasLeft, e.pageY - canvasTop];
}

function getBoardPos(e) {
    let aux = getRelPos(e);
    return [Math.floor(aux[1]/squareSize), Math.floor(aux[0]/squareSize)];
}

let pointerDown = function() {
    return function(e) {
        down = true;
        moved = false;
        let aux = getBoardPos(e);
        let jsonSq = JSON.stringify(selectableSquares);
        let jsonAx = JSON.stringify(aux);
        if(jsonSq.indexOf(jsonAx) != -1) {
            game.makeMove(new Move(selectedPieceName, selectedPiece, aux));
            selectedPiece = [-1, -1];
            selectedPieceName = " ";
            selectableSquares = [];

            // animação viria aqui, eu acho

            moved = true;
        } else if(game.board[aux[0]][aux[1]] == ' ' || (aux[0] == selectedPiece[0] && aux[1] == selectedPiece[1])) {
            selectedPiece = [-1, -1];
            selectedPieceName = " ";
            selectableSquares = [];
        } else if(getPieceColor(game.board[aux[0]][aux[1]]) == game.playingAs && game.next == game.playingAs) {
            selectedPiece = aux;
            selectedPieceName = game.board[aux[0]][aux[1]];
            selectableSquares = generatePossibleMovesForPiece(game.FEN, game.board, selectedPiece);
        }
        redraw(game.board);
        if(moved) {
            game.AImakeMove(getNextPosition(game.FEN, 3));
            redraw(game.board);
            moved = false;
        }
    };
};

/*let pointerMove = function() {
    return function(e) {
        let pos = getRelPos(e);
        if(state.down) {
            state.x = pos[0];
            state.y = pos[1];
            console.log(state.x, state.y);
        }
    };
};*/

let pointerUp = function() {
    return function(e) {
        down = false;
    };
};

canvas.addEventListener('mousedown', pointerDown());
//canvas.addEventListener('mousemove', pointerMove());
canvas.addEventListener('mouseup', pointerUp());
drawBaseBoard()