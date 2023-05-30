"use strict";
function minimax(board, originalBoard, depth, aiColor, color, alpha, beta) {
    let value = 0;
    let nextColor = color == "b" ? "w" : "b";
    let possibilities;
    if (depth == 0)
        return evaluatePosition(board, originalBoard, aiColor);
    else if (aiColor == color) {
        value = Number.MIN_SAFE_INTEGER;
        possibilities = generateNextPossiblePositions(board);
        for (let i = 0; i < possibilities.length; i++) {
            value = Math.max(value, minimax(possibilities[i], originalBoard, depth - 1, aiColor, nextColor, alpha, beta));
            alpha = Math.max(alpha, value);
            if (beta <= alpha)
                break;
        }
        return value;
    }
    else {
        value = Number.MAX_SAFE_INTEGER;
        possibilities = generateNextPossiblePositions(board);
        for (let i = 0; i < possibilities.length; i++) {
            value = Math.min(value, minimax(possibilities[i], originalBoard, depth - 1, aiColor, nextColor, alpha, beta));
            beta = Math.min(beta, value);
            if (beta <= alpha)
                break;
        }
        return value;
    }
}
function principalVariationSearch(board, originalBoard, depth, aiColor, color, alpha, beta) {
    let value = 0;
    let nextColor = color == "b" ? "w" : "b";
    let possibilities = generateNextPossiblePositions(board);
    let bSearchPv = true;
    if (depth == 0)
        return evaluatePosition(board, originalBoard, aiColor);
    for (let i = 0; i < possibilities.length; i++) {
        if (bSearchPv) {
            value = -principalVariationSearch(possibilities[i], originalBoard, depth - 1, aiColor, nextColor, -beta, -alpha);
        }
        else {
            value = -principalVariationSearch(possibilities[i], originalBoard, depth - 1, aiColor, nextColor, -alpha - 1, -alpha);
        }
        if (value >= beta)
            return beta;
        if (value > alpha) {
            alpha = value;
            bSearchPv = false;
        }
    }
    return alpha;
}
function evaluatePosition(board, originalBoard, aiColor) {
    let enemy = aiColor == "b" ? "w" : "b";
    let pastMaterialEval = getMaterial(FENToArray(originalBoard.value), aiColor) - getMaterial(FENToArray(originalBoard.value), enemy);
    let currMaterialEval = getMaterial(FENToArray(board.value), aiColor) - getMaterial(FENToArray(board.value), enemy);
    if (currMaterialEval == pastMaterialEval)
        return 0;
    else
        return currMaterialEval - pastMaterialEval;
}
function getNextPosition(board, depth) {
    let possiblePositions = generateNextPossiblePositions(board);
    let positionStrength = [];
    let i = 0;
    possiblePositions.forEach(position => { positionStrength[i] = minimax(position, board, depth, position.next, position.next, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER); i++; });
    return depth % 2 == 0 ? possiblePositions[positionStrength.indexOf(Math.max.apply(Math, positionStrength))] : possiblePositions[positionStrength.indexOf(Math.min.apply(Math, positionStrength))];
}
