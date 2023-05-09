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
    public board: string[][];
    public FEN: StructFEN;

    constructor(playingAs: string) {
        this.FEN = new StructFEN(this.initialStatus);
        this.board = FENToArray(this.initialStatus);
        this.playingAs = playingAs;
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
        this.futureLocation = location;
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

function isChecked(board: string[][], kingColor: string): boolean {
    let location: number[] = [-1,-1];
    let kingPiece: string = kingColor == "w" ? "K" : "k";
    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            if(board[x][y] == kingPiece) {
                location[0] = x;
                location[1] = y;
                break;
            }
        }
        if(location[0] != -1) break;
    }
    ////////////////
    for(let i = 1; i < 8; i++) {

    }
    return true;
}

function generateNextPossiblePositions(FEN: StructFEN): StructFEN[] {
    let board: string[][] = FENToArray(FEN.value);
    let pieceMoves: number[][];
    let moves: StructFEN[] = [];
    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            if(getPieceColor(board[x][y]) == FEN.next) {
                pieceMoves = generatePossibleMovesForPiece(FEN, FENToArray(FEN.value), [x,y]);
                moves = moves.concat(pieceMoves.map(v => {
                    let futureBoard: string[][] = board.map(a => {return {...a}});
                    futureBoard[v[0]][v[1]] = futureBoard[x][y];
                    futureBoard[x][y] = ' ';
                    return new StructFEN(ArrayToFEN(futureBoard));
                }));
                //moves = moves.concat(pieceMoves.map(v => new Move(board[x][y], [x,y], v)));
            }
        }
    }
    return moves;
}

function generatePossibleMovesForPiece(FEN: StructFEN, board: string[][], location: number[]): number[][] {
    let piece: string = board[location[0]][location[1]];
    let color: string = getPieceColor(piece);
    if(color == FEN.next) {
        let unverified_moves: number[][] = [];
        let moves: number[][] = [];
        switch(piece.toUpperCase()) {
            case 'R':
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]+i,location[1]];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]-i,location[1]];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                    
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0],location[1]+i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                    
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0],location[1]-i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
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
                    let move: number[] = [location[0]+i,location[1]+i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]+i,location[1]-i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                    
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]-i,location[1]+i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                    
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]-i,location[1]-i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                }
                break;
            case 'Q':
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]+i,location[1]];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]-i,location[1]];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                    
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0],location[1]+i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                    
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0],location[1]-i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]+i,location[1]+i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]+i,location[1]-i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                    
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]-i,location[1]+i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
                    
                }
                for(let i = 1;; i++) {
                    let move: number[] = [location[0]-i,location[1]-i];
                    if(!isOutOfBounds(move) && getPieceColor(board[move[0]][move[1]]) == " ") unverified_moves.push(move);
                    else {
                        unverified_moves.push(move);
                        break;
                    }
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
        let temp_board: string[][];
        unverified_moves.forEach(move => {
            if(!isOutOfBounds(move) && color != getPieceColor(board[move[0]][move[1]]) && (board[move[0]][move[1]] != 'K' || board[move[0]][move[1]] != 'k') /*&& !isChecked(temp_board, FEN.next)*/) moves.push(move);
        });
        return moves;
    } else {
        return [];
    }
}

let game = new Game("w");
console.log(generateNextPossiblePositions(game.FEN));