"use strict";
function minimax(board, depth, aiColor, color) {
    let value = 0;
    let nextColor = color == "b" ? "w" : "b";
    let enemy = aiColor == "b" ? "w" : "b";
    let possibilities;
    if (depth == 0)
        return getMaterial(FENToArray(board.value), color) - getMaterial(FENToArray(board.value), nextColor);
    else if (aiColor != color) {
        value = 1000;
        possibilities = generateNextPossiblePositions(board);
        possibilities.forEach(possibility => value = Math.min(value, minimax(possibility, depth - 1, aiColor, nextColor)));
        return value;
    }
    else {
        value = -1000;
        possibilities = generateNextPossiblePositions(board);
        possibilities.forEach(possibility => value = Math.max(value, minimax(possibility, depth - 1, aiColor, nextColor)));
        return value;
    }
}
function getNextPosition(board, depth) {
    let possiblePositions = generateNextPossiblePositions(board);
    let positionStrength = [];
    let i = 0;
    possiblePositions.forEach(position => { positionStrength[i] = minimax(position, depth, position.next, position.next); i++; });
    return depth % 2 == 0 ? possiblePositions[positionStrength.indexOf(Math.min.apply(Math, positionStrength))] : possiblePositions[positionStrength.indexOf(Math.max.apply(Math, positionStrength))];
}
let game = new Game("w");
game.startFromDifferentPosition("r3k2r/pbpp1pp1/1pn1p2p/4P3/1b1P1q2/3B1N2/PPP1NPPP/R2Q1RK1 w - - 1 1", "b");
console.log(FENToArray(game.FEN.value));
console.log(FENToArray(getNextPosition(game.FEN, 2).value));
