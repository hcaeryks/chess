/*
    coisas pra fazer:
    programar en passant, promoção e castle
    ordem de jogo
    escrever função que recebe movimento do front end e atualiza tudo
*/


class Game {
    private initialStatus: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    public whiteQueenRook: number = 1;
    public whiteKingRook: number = 1;
    public blackQueenRook: number = 1;
    public blackKingRook: number = 1;
    public playingAs: string; // "w" or "b"
    public next: string = "w";
    public board: string[][];
    public FEN: StructFEN;
    public FENvalue: string;
    public halfMoveClock: number = 0;
    public fullMoveClock: number = 1;

    constructor(playingAs: string) {
        this.FEN = new StructFEN(this.initialStatus);
        this.FENvalue = this.initialStatus;
        this.board = FENToArray(this.initialStatus);
        this.playingAs = playingAs;
    }

    public startFromDifferentPosition(FEN: string, playingAs: string) {
        this.FEN = new StructFEN(FEN);
        this.FENvalue = FEN;
        this.board = FENToArray(FEN);
        this.playingAs = playingAs;
    }

    public AImakeMove(move: string) {
        let file: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
        let start: number[] = [8-parseInt(move.charAt(1)), file.indexOf(move.charAt(0))]
        let end: number[] = [8-parseInt(move.charAt(3)), file.indexOf(move.charAt(2))]
        let piece: string = this.board[start[0]][start[1]];
        this.board[end[0]][end[1]] = piece;
        this.board[start[0]][start[1]] = ' ';
        this.fullMoveClock++;
        this.next = this.next == "w" ? "b" : "w";
        console.log(piece, start, end, move);
        return [piece, start, end];
    }

    public makeMove(move: Move) {
        let color = getPieceColor(move.piece);
        let piece: string = move.piece.toUpperCase();
        if(piece == "K") {
            if(color == "w") { this.whiteKingRook = 0; this.whiteQueenRook = 0; }
            else if(color == "b") { this.blackKingRook = 0; this.blackQueenRook = 0; }
        } else if (piece == "R") {
            if(move.location[0] == 7 && move.location[1] == 7) this.whiteKingRook = 0; 
            if(move.location[0] == 7 && move.location[1] == 0) this.whiteQueenRook = 0; 
            if(move.location[0] == 0 && move.location[1] == 0) this.blackQueenRook = 0; 
            if(move.location[0] == 0 && move.location[1] == 7) this.blackKingRook = 0; 
        }
        this.board[move.location[0]][move.location[1]] = ' ';
        this.board[move.futureLocation[0]][move.futureLocation[1]] = move.piece;
        this.next = this.next == "w" ? "b" : "w";

        let castling = "";
        if(this.whiteKingRook) castling += "K";
        if(this.whiteQueenRook) castling += "Q";
        if(this.blackKingRook) castling += "k";
        if(this.blackQueenRook) castling += "q"
        if(castling == "") castling = "-";
        this.fullMoveClock++;
        this.FENvalue = ArrayToFEN(this.board) + " " + this.next + " " + castling + " " + "-"/*enpassant*/ + " " + this.halfMoveClock + " " + this.fullMoveClock;
        this.FEN = new StructFEN(this.FENvalue);
    }

    /* essa parte deveria estar no front end, mas vou deixar aqui pra caso queiram usar
    
    public getFlippedBoard() {
        let flippedBoard: string[][] = [[], [], [], [], [], [], [], []];
        for(let x = 7; x >= 0; x--) {
            for(let y = 7; y >= 0; y--) {
                flippedBoard[7-x][7-y] = this.board[x][y];
            }
        }
        return flippedBoard;
    }*/
}

// https://www.chess.com/terms/fen-chess
class StructFEN {
    public value: string;
    public placement: string;
    public next: string;
    public castling: string;
    public enpassant: string;
    public halfmove: number;
    public fullmove: number;

    constructor(FEN: string) {
        let params: string[] = FEN.split(' ');
        this.value = FEN;
        this.placement = params[0];
        this.next = params[1];
        this.castling = params[2];
        this.enpassant = params[3];
        this.halfmove = parseInt(params[4]);
        this.fullmove = parseInt(params[5]);
    }
}

class Move {
    public piece: string;
    public location: number[];
    public futureLocation: number[];

    constructor(piece: string, location: number[], futureLocation: number[]) {
        this.piece = piece;
        this.location = location;
        this.futureLocation = futureLocation;
    }
}

function FENToArray(FEN: string): string[][] {
    let params: string[] = FEN.split(' ');
    let finds: any = params[0].match(/[1-8]/g);
    for(let find of finds) {
        params[0] = params[0].replace(find, ' '.repeat(parseInt(find)));
    }
    return params[0].split('/').map((v) => v.split(''));
}

function ArrayToFEN(array: string[][]): string {
    let fen: string = array.join('/').replaceAll(',', '');
    let finds: any = fen.match(/[ ]+/g);
    for(let find of finds) {
        fen = fen.replace(find, find.length);
    }
    return fen;
}

function getPieceColor(piece: string): string {
    if(piece == ' ') return " ";
    else if(piece.toUpperCase() == piece) return "w";
    else return "b";
}

function squareIsOccupied(board: string[][], location: number[]): boolean {
    return board[location[0]][location[1]] != ' ' ? true : false;
}

function isOutOfBounds(location: number[]): boolean {
    return (location[0] >= 0 && location[1] >= 0 && location[0] < 8 && location[1] < 8) ? false : true;
}

function getMaterial(board: string[][], color: string) {
    let material: number = 0;
    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            if(getPieceColor(board[x][y]) == color) {
                switch(board[x][y].toUpperCase()) {
                    case "R": material += 5; break;
                    case "N": material += 3; break;
                    case "B": material += 3; break;
                    case "Q": material += 9; break;
                    case "K": material += 0; break;
                    case "P": material += 1; break;
                }
            }
        }
    }
    return material;
}

function isKingChecked(FEN: StructFEN, color: string): boolean {
    let answer: boolean = false;
    let board: string[][];
    let pieceMoves: number[][];
    let attacker: string = color == "w" ? "b" : "w";
    let kingColor: string = color == "w" ? "K" : "k";
    FEN.next = attacker;
    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            board = FENToArray(FEN.value);
            if(getPieceColor(board[x][y]) == attacker) {
                pieceMoves = generatePossibleMovesForPiece(FEN, FENToArray(FEN.value), [x,y], false);
                for(let i = 0; i < pieceMoves.length; i++) {
                    if(board[pieceMoves[i][0]][pieceMoves[i][1]] == kingColor) {
                        answer = true;
                        break;
                    }
                }
            }
        }
    }
    return answer;
}

function generateNextPossiblePositions(FEN: StructFEN): StructFEN[] {
    let board: string[][];
    let pieceMoves: number[][];
    let moves: StructFEN[] = [];
    let nextColor: string = FEN.next == "w" ? "b" : "w";
    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            board = FENToArray(FEN.value);
            if(getPieceColor(board[x][y]) == FEN.next) {
                pieceMoves = generatePossibleMovesForPiece(FEN, FENToArray(FEN.value), [x,y], true);
                pieceMoves = pieceMoves.filter(v => {
                    if(board[v[0]][v[1]] == 'K' || board[v[0]][v[1]] == 'k') return false;
                    return true;
                });
                moves = moves.concat(pieceMoves.map(v => {
                    board = FENToArray(FEN.value);
                    board[v[0]][v[1]] = board[x][y];
                    board[x][y] = ' ';
                    return new StructFEN(ArrayToFEN(board)+" "+nextColor);
                }));
                //moves = moves.concat(pieceMoves.map(v => new Move(board[x][y], [x,y], v)));
            }
        }
    }
    return moves;
}/*
function httpGet(theUrl: any){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}*/

function generatePossibleMovesForPiece(FEN: StructFEN, board: string[][], location: number[], filterOutKings: boolean): number[][] {
    let piece: string = board[location[0]][location[1]];
    if(piece == ' ') return [];
    let color: string = getPieceColor(piece);
    if(color == FEN.next) {
        let unverified_moves: number[][] = [];
        let moves: number[][] = [];
        let c1: boolean = false, c2: boolean = false, c3: boolean = false, c4: boolean = false, c5: boolean = false, c6: boolean = false, c7: boolean = false, c8: boolean = false;
        switch(piece.toUpperCase()) {
            case 'R':
                for(let i = 1;; i++) {
                    if(c1 && c2 && c3 && c4) break;
                    let d1: number[] = [location[0]+i,location[1]];
                    let d2: number[] = [location[0]-i,location[1]];
                    let d3: number[] = [location[0],location[1]+i];
                    let d4: number[] = [location[0],location[1]-i];
                    if(c1 == false && !isOutOfBounds(d1) && getPieceColor(board[d1[0]][d1[1]]) == " ") unverified_moves.push(d1);
                    else { if(c1 == false) { unverified_moves.push(d1); } c1 = true; }
                    if(c2 == false && !isOutOfBounds(d2) && getPieceColor(board[d2[0]][d2[1]]) == " ") unverified_moves.push(d2);
                    else { if(c2 == false) { unverified_moves.push(d2); } c2 = true; }
                    if(c3 == false && !isOutOfBounds(d3) && getPieceColor(board[d3[0]][d3[1]]) == " ") unverified_moves.push(d3);
                    else { if(c3 == false) { unverified_moves.push(d3); } c3 = true; }
                    if(c4 == false && !isOutOfBounds(d4) && getPieceColor(board[d4[0]][d4[1]]) == " ") unverified_moves.push(d4);
                    else { if(c4 == false) { unverified_moves.push(d4); } c4 = true; }
                }
                break;
            case 'N':
                unverified_moves.push([location[0]+2, location[1]+1]);
                unverified_moves.push([location[0]+2, location[1]-1]);
                unverified_moves.push([location[0]+1, location[1]+2]);
                unverified_moves.push([location[0]+1, location[1]-2]);
                unverified_moves.push([location[0]-1, location[1]+2]);
                unverified_moves.push([location[0]-1, location[1]-2]);
                unverified_moves.push([location[0]-2, location[1]+1]);
                unverified_moves.push([location[0]-2, location[1]-1]);
                break;
            case 'B':
                for(let i = 1;; i++) {
                    if(c1 && c2 && c3 && c4) break;
                    let d1: number[] = [location[0]+i,location[1]+i];
                    let d2: number[] = [location[0]+i,location[1]-i];
                    let d3: number[] = [location[0]-i,location[1]+i];
                    let d4: number[] = [location[0]-i,location[1]-i];
                    if(!c1 && !isOutOfBounds(d1) && getPieceColor(board[d1[0]][d1[1]]) == " ") unverified_moves.push(d1);
                    else { if(c1 == false) { unverified_moves.push(d1); } c1 = true; }
                    if(!c2 && !isOutOfBounds(d2) && getPieceColor(board[d2[0]][d2[1]]) == " ") unverified_moves.push(d2);
                    else { if(c2 == false) { unverified_moves.push(d2); } c2 = true; }
                    if(!c3 && !isOutOfBounds(d3) && getPieceColor(board[d3[0]][d3[1]]) == " ") unverified_moves.push(d3);
                    else { if(c3 == false) { unverified_moves.push(d3); } c3 = true; }
                    if(!c4 && !isOutOfBounds(d4) && getPieceColor(board[d4[0]][d4[1]]) == " ") unverified_moves.push(d4);
                    else { if(c4 == false) { unverified_moves.push(d4); } c4 = true; }
                }
                break;
            case 'Q':
                for(let i = 1;; i++) {
                    if(c1 && c2 && c3 && c4 && c5 && c6 && c7 && c8) break;
                    let d1: number[] = [location[0]+i,location[1]];
                    let d2: number[] = [location[0]-i,location[1]];
                    let d3: number[] = [location[0],location[1]+i];
                    let d4: number[] = [location[0],location[1]-i];
                    let d5: number[] = [location[0]+i,location[1]+i];
                    let d6: number[] = [location[0]+i,location[1]-i];
                    let d7: number[] = [location[0]-i,location[1]+i];
                    let d8: number[] = [location[0]-i,location[1]-i];
                    if(!c1 && !isOutOfBounds(d1) && getPieceColor(board[d1[0]][d1[1]]) == " ") unverified_moves.push(d1);
                    else { if(c1 == false) { unverified_moves.push(d1); } c1 = true; }
                    if(!c2 && !isOutOfBounds(d2) && getPieceColor(board[d2[0]][d2[1]]) == " ") unverified_moves.push(d2);
                    else { if(c2 == false) { unverified_moves.push(d2); } c2 = true; }
                    if(!c3 && !isOutOfBounds(d3) && getPieceColor(board[d3[0]][d3[1]]) == " ") unverified_moves.push(d3);
                    else { if(c3 == false) { unverified_moves.push(d3); } c3 = true; }
                    if(!c4 && !isOutOfBounds(d4) && getPieceColor(board[d4[0]][d4[1]]) == " ") unverified_moves.push(d4);
                    else { if(c4 == false) { unverified_moves.push(d4); } c4 = true; }
                    if(!c5 && !isOutOfBounds(d5) && getPieceColor(board[d5[0]][d5[1]]) == " ") unverified_moves.push(d5);
                    else { if(c5 == false) { unverified_moves.push(d5); } c5 = true; }
                    if(!c6 && !isOutOfBounds(d6) && getPieceColor(board[d6[0]][d6[1]]) == " ") unverified_moves.push(d6);
                    else { if(c6 == false) { unverified_moves.push(d6); } c6 = true; }
                    if(!c7 && !isOutOfBounds(d7) && getPieceColor(board[d7[0]][d7[1]]) == " ") unverified_moves.push(d7);
                    else { if(c7 == false) { unverified_moves.push(d7); } c7 = true; }
                    if(!c8 && !isOutOfBounds(d8) && getPieceColor(board[d8[0]][d8[1]]) == " ") unverified_moves.push(d8);
                    else { if(c8 == false) { unverified_moves.push(d8); } c8 = true; }
                }
                break;
            case 'K':
                // TODO: programar castles
                unverified_moves.push([location[0]+1, location[1]+1]);
                unverified_moves.push([location[0]+1, location[1]]);
                unverified_moves.push([location[0]+1, location[1]-1]);
                unverified_moves.push([location[0], location[1]+1]);
                unverified_moves.push([location[0], location[1]-1]);
                unverified_moves.push([location[0]-1, location[1]+1]);
                unverified_moves.push([location[0]-1, location[1]]);
                unverified_moves.push([location[0]-1, location[1]-1]);
                /*if(color == "w") {
                    if(board[7][1] == ' ' && board[7][2] == ' ' && board[7][3] == ' ' && FEN.castling.includes("Q")) {
                        unverified_moves.push([7,2]);
                    }
                    if(board[7][5] == ' ' && board[7][6] == ' ' && FEN.castling.includes("K")) {
                        unverified_moves.push([7,6]);
                    }
                } else {
                    if(board[0][1] == ' ' && board[0][2] == ' ' && board[0][3] == ' ' && FEN.castling.includes("q")) {
                        unverified_moves.push([0,2]);
                    }
                    if(board[0][5] == ' ' && board[0][6] == ' ' && FEN.castling.includes("k")) {
                        unverified_moves.push([0,6]);
                    }
                }*/
                break;
            case 'P':
                // TODO: programar en passant e promoção
                let attacks: number[][];
                if(color == "w") {
                    if(location[0] == 6 && !squareIsOccupied(board, [location[0]-2, location[1]]) && !squareIsOccupied(board, [location[0]-1, location[1]])) unverified_moves.push([location[0]-2, location[1]]);
                    if(!squareIsOccupied(board, [location[0]-1, location[1]])) unverified_moves.push([location[0]-1, location[1]]);
                    attacks = [[location[0]-1, location[1]-1], [location[0]-1, location[1]+1]];
                } else {
                    if(location[0] == 1 && !squareIsOccupied(board, [location[0]+2, location[1]]) && !squareIsOccupied(board, [location[0]+1, location[1]])) unverified_moves.push([location[0]+2, location[1]]);
                    if(!squareIsOccupied(board, [location[0]+1, location[1]])) unverified_moves.push([location[0]+1, location[1]]);
                    attacks = [[location[0]+1, location[1]-1], [location[0]+1, location[1]+1]];
                }
                attacks.forEach(attack => {
                    if(!isOutOfBounds(attack) && color != getPieceColor(board[attack[0]][attack[1]]) && " " != getPieceColor(board[attack[0]][attack[1]])) unverified_moves.push(attack);
                });
                break;
        }
        // TODO: invalidar movimentos que causam check em si mesmo
        let temp_board: string[][] = [["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""], ["", "", "", "", "", "", "", ""]];
        for(let x = 0; x < 8; x++) {
            for(let y = 0; y < 8; y ++) {
                temp_board[x][y] = board[x][y];
            }
        }
        let myKing: string = color == "w" ? "K" : "k";
        let oppositeKing: string = color == "w" ? "k" : "K";
        unverified_moves.forEach(move => {
            if(!isOutOfBounds(move) && color != getPieceColor(board[move[0]][move[1]]) && board[move[0]][move[1]] != myKing) {
                if(filterOutKings) {
                    let aux1: string = temp_board[location[0]][location[1]];
                    let aux2: string = temp_board[move[0]][move[1]];
                    temp_board[location[0]][location[1]] = ' ';
                    temp_board[move[0]][move[1]] = piece;
                    if(board[move[0]][move[1]] != oppositeKing && !isKingChecked(new StructFEN(ArrayToFEN(temp_board)), color)) moves.push(move);
                    temp_board[location[0]][location[1]] = aux1;
                    temp_board[move[0]][move[1]] = aux2;
                }
                else moves.push(move);
            }
        });
        return moves;
    } else {
        return [];
    }
}