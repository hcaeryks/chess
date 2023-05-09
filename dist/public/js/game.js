"use strict";
/*
    coisas pra fazer:
    programar en passant, promoção e castle
    ordem de jogo
    escrever função que recebe movimento do front end e atualiza tudo
*/
class Game {
    constructor(playingAs) {
        this.initialStatus = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        this.whiteQueenRook = 1;
        this.whiteKingRook = 1;
        this.blackQueenRook = 1;
        this.blackKingRook = 1;
        this.FEN = new StructFEN(this.initialStatus);
        this.board = FENToArray(this.initialStatus);
        this.playingAs = playingAs;
    }
    startFromDifferentPosition(FEN, playingAs) {
        this.FEN = new StructFEN(FEN);
        this.board = FENToArray(FEN);
        this.playingAs = playingAs;
    }
}
// https://www.chess.com/terms/fen-chess
class StructFEN {
    constructor(FEN) {
        let params = FEN.split(' ');
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
    constructor(piece, location, futureLocation) {
        this.piece = piece;
        this.location = location;
        this.futureLocation = location;
    }
}
function FENToArray(FEN) {
    let params = FEN.split(' ');
    let finds = params[0].match(/[1-8]/g);
    for (let find of finds) {
        params[0] = params[0].replace(find, ' '.repeat(parseInt(find)));
    }
    return params[0].split('/').map((v) => v.split(''));
}
function ArrayToFEN(array) {
    let fen = array.join('/').replaceAll(',', '');
    let finds = fen.match(/[ ]+/g);
    for (let find of finds) {
        fen = fen.replace(find, find.length);
    }
    return fen;
}
function getPieceColor(piece) {
    if (piece == ' ')
        return " ";
    else if (piece.toUpperCase() == piece)
        return "w";
    else
        return "b";
}
function squareIsOccupied(board, location) {
    return board[location[0]][location[1]] != ' ' ? true : false;
}
function isOutOfBounds(location) {
    return (location[0] >= 0 && location[1] >= 0 && location[0] < 8 && location[1] < 8) ? false : true;
}
function getMaterial(board, color) {
    let material = 0;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (getPieceColor(board[x][y]) == color) {
                switch (board[x][y].toUpperCase()) {
                    case "R":
                        material += 5;
                        break;
                    case "N":
                        material += 3;
                        break;
                    case "B":
                        material += 3;
                        break;
                    case "Q":
                        material += 9;
                        break;
                    case "K":
                        material += 0;
                        break;
                    case "P":
                        material += 1;
                        break;
                }
            }
        }
    }
    return material;
}
function isChecked(board, kingColor) {
    let location = [-1, -1];
    let kingPiece = kingColor == "w" ? "K" : "k";
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (board[x][y] == kingPiece) {
                location[0] = x;
                location[1] = y;
                break;
            }
        }
        if (location[0] != -1)
            break;
    }
    ////////////////
    for (let i = 1; i < 8; i++) {
    }
    return true;
}
function generateNextPossiblePositions(FEN) {
    let board;
    let pieceMoves;
    let moves = [];
    let nextColor = FEN.next == "w" ? "b" : "w";
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            board = FENToArray(FEN.value);
            if (getPieceColor(board[x][y]) == FEN.next) {
                pieceMoves = generatePossibleMovesForPiece(FEN, FENToArray(FEN.value), [x, y]);
                moves = moves.concat(pieceMoves.map(v => {
                    board = FENToArray(FEN.value);
                    board[v[0]][v[1]] = board[x][y];
                    board[x][y] = ' ';
                    return new StructFEN(ArrayToFEN(board) + " " + nextColor);
                }));
                //moves = moves.concat(pieceMoves.map(v => new Move(board[x][y], [x,y], v)));
            }
        }
    }
    return moves;
}
function generatePossibleMovesForPiece(FEN, board, location) {
    let piece = board[location[0]][location[1]];
    let color = getPieceColor(piece);
    if (color == FEN.next) {
        let unverified_moves = [];
        let moves = [];
        let c1 = false, c2 = false, c3 = false, c4 = false, c5 = false, c6 = false, c7 = false, c8 = false;
        switch (piece.toUpperCase()) {
            case 'R':
                for (let i = 1;; i++) {
                    if (c1 && c2 && c3 && c4)
                        break;
                    let d1 = [location[0] + i, location[1]];
                    let d2 = [location[0] - i, location[1]];
                    let d3 = [location[0], location[1] + i];
                    let d4 = [location[0], location[1] - i];
                    if (!isOutOfBounds(d1) && getPieceColor(board[d1[0]][d1[1]]) == " ")
                        unverified_moves.push(d1);
                    else {
                        unverified_moves.push(d1);
                        c1 = true;
                        break;
                    }
                    if (!isOutOfBounds(d2) && getPieceColor(board[d2[0]][d2[1]]) == " ")
                        unverified_moves.push(d2);
                    else {
                        unverified_moves.push(d2);
                        c2 = true;
                        break;
                    }
                    if (!isOutOfBounds(d3) && getPieceColor(board[d3[0]][d3[1]]) == " ")
                        unverified_moves.push(d3);
                    else {
                        unverified_moves.push(d3);
                        c3 = true;
                        break;
                    }
                    if (!isOutOfBounds(d4) && getPieceColor(board[d4[0]][d4[1]]) == " ")
                        unverified_moves.push(d4);
                    else {
                        unverified_moves.push(d4);
                        c4 = true;
                        break;
                    }
                }
                break;
            case 'N':
                unverified_moves.push([location[0] + 2, location[1] + 1]);
                unverified_moves.push([location[0] + 2, location[1] - 1]);
                unverified_moves.push([location[0] + 1, location[1] + 2]);
                unverified_moves.push([location[0] + 1, location[1] - 2]);
                unverified_moves.push([location[0] - 1, location[1] + 2]);
                unverified_moves.push([location[0] - 1, location[1] - 2]);
                unverified_moves.push([location[0] - 2, location[1] + 1]);
                unverified_moves.push([location[0] - 2, location[1] - 1]);
                break;
            case 'B':
                for (let i = 1;; i++) {
                    if (c1 && c2 && c3 && c4)
                        break;
                    let d1 = [location[0] + i, location[1] + i];
                    let d2 = [location[0] + i, location[1] - i];
                    let d3 = [location[0] - i, location[1] + i];
                    let d4 = [location[0] - i, location[1] - i];
                    if (!isOutOfBounds(d1) && getPieceColor(board[d1[0]][d1[1]]) == " ")
                        unverified_moves.push(d1);
                    else {
                        unverified_moves.push(d1);
                        c1 = true;
                        break;
                    }
                    if (!isOutOfBounds(d2) && getPieceColor(board[d2[0]][d2[1]]) == " ")
                        unverified_moves.push(d2);
                    else {
                        unverified_moves.push(d2);
                        c2 = true;
                        break;
                    }
                    if (!isOutOfBounds(d3) && getPieceColor(board[d3[0]][d3[1]]) == " ")
                        unverified_moves.push(d3);
                    else {
                        unverified_moves.push(d3);
                        c3 = true;
                        break;
                    }
                    if (!isOutOfBounds(d4) && getPieceColor(board[d4[0]][d4[1]]) == " ")
                        unverified_moves.push(d4);
                    else {
                        unverified_moves.push(d4);
                        c4 = true;
                        break;
                    }
                }
                break;
            case 'Q':
                for (let i = 1;; i++) {
                    if (c1 && c2 && c3 && c4 && c5 && c6 && c7 && c8)
                        break;
                    let d1 = [location[0] + i, location[1]];
                    let d2 = [location[0] - i, location[1]];
                    let d3 = [location[0], location[1] + i];
                    let d4 = [location[0], location[1] - i];
                    let d5 = [location[0] + i, location[1] + i];
                    let d6 = [location[0] + i, location[1] - i];
                    let d7 = [location[0] - i, location[1] + i];
                    let d8 = [location[0] - i, location[1] - i];
                    if (!isOutOfBounds(d1) && getPieceColor(board[d1[0]][d1[1]]) == " ")
                        unverified_moves.push(d1);
                    else {
                        unverified_moves.push(d1);
                        c1 = true;
                        break;
                    }
                    if (!isOutOfBounds(d2) && getPieceColor(board[d2[0]][d2[1]]) == " ")
                        unverified_moves.push(d2);
                    else {
                        unverified_moves.push(d2);
                        c2 = true;
                        break;
                    }
                    if (!isOutOfBounds(d3) && getPieceColor(board[d3[0]][d3[1]]) == " ")
                        unverified_moves.push(d3);
                    else {
                        unverified_moves.push(d3);
                        c3 = true;
                        break;
                    }
                    if (!isOutOfBounds(d4) && getPieceColor(board[d4[0]][d4[1]]) == " ")
                        unverified_moves.push(d4);
                    else {
                        unverified_moves.push(d4);
                        c4 = true;
                        break;
                    }
                    if (!isOutOfBounds(d5) && getPieceColor(board[d5[0]][d5[1]]) == " ")
                        unverified_moves.push(d5);
                    else {
                        unverified_moves.push(d5);
                        c5 = true;
                        break;
                    }
                    if (!isOutOfBounds(d6) && getPieceColor(board[d6[0]][d6[1]]) == " ")
                        unverified_moves.push(d6);
                    else {
                        unverified_moves.push(d6);
                        c6 = true;
                        break;
                    }
                    if (!isOutOfBounds(d7) && getPieceColor(board[d7[0]][d7[1]]) == " ")
                        unverified_moves.push(d7);
                    else {
                        unverified_moves.push(d7);
                        c7 = true;
                        break;
                    }
                    if (!isOutOfBounds(d8) && getPieceColor(board[d8[0]][d8[1]]) == " ")
                        unverified_moves.push(d8);
                    else {
                        unverified_moves.push(d8);
                        c8 = true;
                        break;
                    }
                }
                break;
            case 'K':
                // TODO: programar castles
                unverified_moves.push([location[0] + 1, location[1] + 1]);
                unverified_moves.push([location[0] + 1, location[1]]);
                unverified_moves.push([location[0] + 1, location[1] - 1]);
                unverified_moves.push([location[0], location[1] + 1]);
                unverified_moves.push([location[0], location[1] - 1]);
                unverified_moves.push([location[0] - 1, location[1] + 1]);
                unverified_moves.push([location[0] - 1, location[1]]);
                unverified_moves.push([location[0] - 1, location[1] - 1]);
                break;
            case 'P':
                // TODO: programar en passant e promoção
                let attacks;
                if (color == "w") {
                    if (location[0] == 6 && !squareIsOccupied(board, [location[0] - 2, location[1]]) && !squareIsOccupied(board, [location[0] - 1, location[1]]))
                        unverified_moves.push([location[0] - 2, location[1]]);
                    if (!squareIsOccupied(board, [location[0] - 1, location[1]]))
                        unverified_moves.push([location[0] - 1, location[1]]);
                    attacks = [[location[0] - 1, location[1] - 1], [location[0] - 1, location[1] + 1]];
                }
                else {
                    if (location[0] == 1 && !squareIsOccupied(board, [location[0] + 2, location[1]]) && !squareIsOccupied(board, [location[0] + 1, location[1]]))
                        unverified_moves.push([location[0] + 2, location[1]]);
                    if (!squareIsOccupied(board, [location[0] + 1, location[1]]))
                        unverified_moves.push([location[0] + 1, location[1]]);
                    attacks = [[location[0] + 1, location[1] - 1], [location[0] + 1, location[1] + 1]];
                }
                attacks.forEach(attack => {
                    if (!isOutOfBounds(attack) && color != getPieceColor(board[attack[0]][attack[1]]) && " " != getPieceColor(board[attack[0]][attack[1]]))
                        unverified_moves.push(attack);
                });
                break;
        }
        // TODO: invalidar movimentos que causam check em si mesmo
        let temp_board;
        unverified_moves.forEach(move => {
            if (!isOutOfBounds(move) && color != getPieceColor(board[move[0]][move[1]]) && (board[move[0]][move[1]] != 'K' || board[move[0]][move[1]] != 'k') /*&& !isChecked(temp_board, FEN.next)*/)
                moves.push(move);
        });
        return moves;
    }
    else {
        return [];
    }
}
