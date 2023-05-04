/* important notes: 
    bottom left corner of the board is [1,1]
    black pieces are UPPERCASE and white pieces are lowercase
    pawn = p|P, knight = n|N, bishop = b|B, rook = r|R, queen = q|Q, king = k|K
*/

class Move {
    public piece1:string;
    public piece2:string;
    public pos1:number[];
    public pos2:number[];
    public special_move:string;
    public score:number;

    constructor(piece1:string, pos1:number[], piece2:string, pos2:number[], special_move:string) {
        this.piece1 = piece1; // piece being moved
        this.piece2 = piece2; // piece being taken (can be null)
        this.pos1 = pos1; // position of piece1 in the board [x,y]
        this.pos2 = pos2; // ^ but for piece2
        this.special_move = special_move; // "lcastle", "rcastle", "en passant" and "promote"
        this.score = this.calcScore();
    }

    calcScore() {
        let score = 0;

        switch(this.piece2.toLowerCase()) {
            case "p": score += 1; break;
            case "n": score += 3; break;
            case "b": score += 3; break;
            case "r": score += 5; break;
            case "q": score += 9; break;
        }

        /*if(this.piece2.toLowerCase != " ") {
            switch(this.piece1.toLowerCase()) {
                case "p": score += 3; break;
                default: score += 2; break;
            }
        }*/

        return score;
    }
}


class Engine {
    king_moved = 0; // for checking if castling is valid at all
    lrook_moved = 0; // "lcastle" validation
    rrook_moved = 0; // "rcastle" validation
    pawn_dmoved = 0; // for checking if "en passant" is valid

    public board:string[][];
    public color:number;

    constructor(board: string[][], color: number) {
        this.board = board; // 8x8 matrix
        this.color = color; // 0 = white, 1 = black
    }

    getColor(letter: string) {
        if(letter == " ") return null;
        return (letter == letter.toUpperCase() ? 1 : 0);
    }


    generateBoard(move: Move) {
        let new_board = this.board;
        new_board[move.pos1[0]][move.pos1[1]] = " ";
        new_board[move.pos2[0]][move.pos2[1]] = move.piece1;
        // TODO: make it work for special_move
        return new_board;
    }

    // PLEASE, CLEAN THIS CODE, MAYBE CREATE SEPARATE FUNCTION FOR BISHOP, ROOK AND QUEEN (navigate diag / ho / ve ??)
    searchPieceMoves(pos: number[]) {
        let moves:any[]=[];
        let piece = this.board[pos[0]][pos[1]];
        let color = this.getColor(piece);
        let x = pos[0];
        let y = pos[1];

        // NEED TO SEARCH FOR CHECKS FOR VERIFYING COORDS, CREATE A FUNCTION FOR THAT
        switch(piece.toLowerCase()) {
            case "p":
                let p_unverified_coords:any[]=[]; // [X, Y, EN PASSANT (0 OR 1)]
                if(!color) {
                    if(x==6 && this.board[x-1][y] == " ") p_unverified_coords.push([x-2,y,0]);
                    p_unverified_coords.push([x-1,y,0]);
                    // TODO: en passant if
                } else {
                    if(x==1 && this.board[x+1][y] == " ") p_unverified_coords.push([x+2,y,0]);
                    p_unverified_coords.push([x+1,y]);
                    // TODO: en passant if
                }
                p_unverified_coords.forEach(arr => {
                    if(arr[0] >= 0 && arr[0] < 8 && arr[1] >= 0 && arr[1] < 8 && (this.board[arr[0]][arr[1]] == " " /* en passant rule would go here i think */)) moves.push(new Move(piece, pos, this.board[arr[0]][arr[1]], [arr[0], arr[1]],''));
                });
                break;
            case "n":
                let n_unverified_coords = [[x+2,y+1], [x+2,y-1], [x-2,y+1], [x-2,y-1], [x+1,y+2], [x+1,y-2], [x-1,y+2], [x-1,y-2]];
                n_unverified_coords.forEach(arr => {
                    if(arr[0] >= 0 && arr[0] < 8 && arr[1] >= 0 && arr[1] < 8 && this.getColor(this.board[arr[0]][arr[1]]) != color) moves.push(new Move(piece, pos, this.board[arr[0]][arr[1]], arr,''));
                });
                break;
            case "b":
                let b_arr = [x,y];
                for(let i = 1;;i++) { // TOP RIGHT
                    b_arr = [x-i,y+i];
                    if(b_arr[0] >= 0 && b_arr[0] < 8 && b_arr[1] >= 0 && b_arr[1] < 8) {
                        if(this.board[b_arr[0]][b_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[b_arr[0]][b_arr[1]], b_arr,''));
                        } else if(this.getColor(this.board[b_arr[0]][b_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[b_arr[0]][b_arr[1]], b_arr,''));
                            break;
                        } else if(this.getColor(this.board[b_arr[0]][b_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // TOP LEFT
                    b_arr = [x-i,y-i];
                    if(b_arr[0] >= 0 && b_arr[0] < 8 && b_arr[1] >= 0 && b_arr[1] < 8) {
                        if(this.board[b_arr[0]][b_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[b_arr[0]][b_arr[1]], b_arr,''));
                        } else if(this.getColor(this.board[b_arr[0]][b_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[b_arr[0]][b_arr[1]], b_arr,''));
                            break;
                        } else if(this.getColor(this.board[b_arr[0]][b_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // BOTTOM RIGHT
                    b_arr = [x+i,y+i];
                    if(b_arr[0] >= 0 && b_arr[0] < 8 && b_arr[1] >= 0 && b_arr[1] < 8) {
                        if(this.board[b_arr[0]][b_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[b_arr[0]][b_arr[1]], b_arr,''));
                        } else if(this.getColor(this.board[b_arr[0]][b_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[b_arr[0]][b_arr[1]], b_arr,''));
                            break;
                        } else if(this.getColor(this.board[b_arr[0]][b_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // BOTTOM LEFT
                    b_arr = [x+i,y-i];
                    if(b_arr[0] >= 0 && b_arr[0] < 8 && b_arr[1] >= 0 && b_arr[1] < 8) {
                        if(this.board[b_arr[0]][b_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[b_arr[0]][b_arr[1]], b_arr,''));
                        } else if(this.getColor(this.board[b_arr[0]][b_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[b_arr[0]][b_arr[1]], b_arr,''));
                            break;
                        } else if(this.getColor(this.board[b_arr[0]][b_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                break;
            case "r":
                let r_arr = [x,y];
                for(let i = 1;;i++) { // BOTTOM
                    r_arr = [x+i,y];
                    if(r_arr[0] >= 0 && r_arr[0] < 8 && r_arr[1] >= 0 && r_arr[1] < 8) {
                        if(this.board[r_arr[0]][r_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[r_arr[0]][r_arr[1]], r_arr,''));
                        } else if(this.getColor(this.board[r_arr[0]][r_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[r_arr[0]][r_arr[1]], r_arr,''));
                            break;
                        } else if(this.getColor(this.board[r_arr[0]][r_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // TOP
                    r_arr = [x-i,y];
                    if(r_arr[0] >= 0 && r_arr[0] < 8 && r_arr[1] >= 0 && r_arr[1] < 8) {
                        if(this.board[r_arr[0]][r_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[r_arr[0]][r_arr[1]], r_arr,''));
                        } else if(this.getColor(this.board[r_arr[0]][r_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[r_arr[0]][r_arr[1]], r_arr,''));
                            break;
                        } else if(this.getColor(this.board[r_arr[0]][r_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // RIGHT
                    r_arr = [x,y+i];
                    if(r_arr[0] >= 0 && r_arr[0] < 8 && r_arr[1] >= 0 && r_arr[1] < 8) {
                        if(this.board[r_arr[0]][r_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[r_arr[0]][r_arr[1]], r_arr,''));
                        } else if(this.getColor(this.board[r_arr[0]][r_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[r_arr[0]][r_arr[1]], r_arr,''));
                            break;
                        } else if(this.getColor(this.board[r_arr[0]][r_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // LEFT
                    r_arr = [x,y-i];
                    if(r_arr[0] >= 0 && r_arr[0] < 8 && r_arr[1] >= 0 && r_arr[1] < 8) {
                        if(this.board[r_arr[0]][r_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[r_arr[0]][r_arr[1]], r_arr,''));
                        } else if(this.getColor(this.board[r_arr[0]][r_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[r_arr[0]][r_arr[1]], r_arr,''));
                            break;
                        } else if(this.getColor(this.board[r_arr[0]][r_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                break;
            case "q":
                let q_arr = [x,y];
                for(let i = 1;;i++) { // TOP RIGHT
                    q_arr = [x-i,y+i];
                    if(q_arr[0] >= 0 && q_arr[0] < 8 && q_arr[1] >= 0 && q_arr[1] < 8) {
                        if(this.board[q_arr[0]][q_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                            break;
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // TOP LEFT
                    q_arr = [x-i,y-i];
                    if(q_arr[0] >= 0 && q_arr[0] < 8 && q_arr[1] >= 0 && q_arr[1] < 8) {
                        if(this.board[q_arr[0]][q_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                            break;
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // BOTTOM RIGHT
                    q_arr = [x+i,y+i];
                    if(q_arr[0] >= 0 && q_arr[0] < 8 && q_arr[1] >= 0 && q_arr[1] < 8) {
                        if(this.board[q_arr[0]][q_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                            break;
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // BOTTOM LEFT
                    q_arr = [x+i,y-i];
                    if(q_arr[0] >= 0 && q_arr[0] < 8 && q_arr[1] >= 0 && q_arr[1] < 8) {
                        if(this.board[q_arr[0]][q_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                            break;
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // BOTTOM
                    q_arr = [x+i,y];
                    if(q_arr[0] >= 0 && q_arr[0] < 8 && q_arr[1] >= 0 && q_arr[1] < 8) {
                        if(this.board[q_arr[0]][q_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                            break;
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // TOP
                    q_arr = [x-i,y];
                    if(q_arr[0] >= 0 && q_arr[0] < 8 && q_arr[1] >= 0 && q_arr[1] < 8) {
                        if(this.board[q_arr[0]][q_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                            break;
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // RIGHT
                    q_arr = [x,y+i];
                    if(q_arr[0] >= 0 && q_arr[0] < 8 && q_arr[1] >= 0 && q_arr[1] < 8) {
                        if(this.board[q_arr[0]][q_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                            break;
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                for(let i = 1;;i++) { // LEFT
                    q_arr = [x,y-i];
                    if(q_arr[0] >= 0 && q_arr[0] < 8 && q_arr[1] >= 0 && q_arr[1] < 8) {
                        if(this.board[q_arr[0]][q_arr[1]] == " ") {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) != color) {
                            moves.push(new Move(piece, pos, this.board[q_arr[0]][q_arr[1]], q_arr,''));
                            break;
                        } else if(this.getColor(this.board[q_arr[0]][q_arr[1]]) == color) {
                            break;
                        } else break;
                    } else break;
                }
                break;
            case "k":
                let k_unverified_coords = [[x+1,y+1], [x+1,y-1], [x-1,y+1], [x-1,y-1], [x+1,y], [x,y+1], [x-1,y], [x,y-1]];
                k_unverified_coords.forEach(arr => {
                    if(arr[0] >= 0 && arr[0] < 8 && arr[1] >= 0 && arr[1] < 8 && this.getColor(this.board[arr[0]][arr[1]]) != color) moves.push(new Move(piece, pos, this.board[arr[0]][arr[1]], arr,''));
                });
                break;
        }

        return moves;
    }

    allPossibleMoves() {
        let moves:any[] = [];

        for(let x = 8; x > 0; x--) {
            for(let y = 8; y > 0; y--) {
                if(this.color == this.getColor(this.board[x-1][y-1])) {
                    moves = moves.concat(this.searchPieceMoves([x-1,y-1]));
                }
            }
        }

        return moves;
    }
    
    nextMove(board: string[][]) : string[][] {
        let moves = this.allPossibleMoves();
        moves.sort(function(a, b) { 
            var dScore = b.score - a.score; // sort by score
            if(dScore) return dScore;

            var dCenter = Math.abs(4-a.pos1[0]) + Math.abs(3-a.pos1[1]) - Math.abs(4-b.pos1[0]) - Math.abs(3-b.pos1[1]); // sort by distance from the center
            return dCenter;
        });
        this.board = this.generateBoard(moves[0]);
        return this.board;
    }
}

let board:string[][] = [["R","N","B","Q","K","B","N","R"],["P","P","P","P","P","P","P","P",],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],["p","p","p","p","p","p","p","p",],["r","n","b","q","k","b","n","r"]];
//let board = [[" "," "," ","b"," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","Q"," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]];
board.forEach(line => console.log(line.toString()));
const engine = new Engine(board,0);
board = engine.nextMove(board);