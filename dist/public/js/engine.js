"use strict";
function minimax(board, depth, aiColor, color) {
    let value = 0;
    let nextColor = color == "b" ? "w" : "b";
    let enemy = aiColor == "b" ? "w" : "b";
    if (depth == 0)
        return getMaterial(board, aiColor) - getMaterial(board, enemy);
    else if (aiColor != color) {
        value = Number.MAX_SAFE_INTEGER;
        return value;
    }
    else {
        value = Number.MIN_SAFE_INTEGER;
        return value;
    }
}
