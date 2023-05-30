function minimax(board: StructFEN, originalBoard: StructFEN, depth: number, aiColor: string, color: string, alpha: number, beta: number) {
    let value: number = 0;
    let nextColor: string = color == "b" ? "w" : "b";
    let possibilities: StructFEN[];
    if(depth == 0) return evaluatePosition(board, originalBoard, aiColor);
    else if(aiColor == color) {
        value = Number.MIN_SAFE_INTEGER;
        possibilities = generateNextPossiblePositions(board);
        for(let i = 0; i < possibilities.length; i++) {
            value = Math.max(value, minimax(possibilities[i], originalBoard, depth-1, aiColor, nextColor, alpha, beta));
            alpha = Math.max(alpha, value);
            if(beta <= alpha) break;
        }
        return value;
    } else {
        value = Number.MAX_SAFE_INTEGER;
        possibilities = generateNextPossiblePositions(board);
        for(let i = 0; i < possibilities.length; i++) {
            value = Math.min(value, minimax(possibilities[i], originalBoard, depth-1, aiColor, nextColor, alpha, beta));
            beta = Math.min(beta, value);
            if(beta <= alpha) break;
        }
        return value;
    }
}

function principalVariationSearch(board: StructFEN, originalBoard: StructFEN, depth: number, aiColor: string, color: string, alpha: number, beta: number) {
    let value: number = 0;
    let nextColor: string = color == "b" ? "w" : "b";
    let possibilities: StructFEN[] = generateNextPossiblePositions(board);
    let bSearchPv: boolean = true;
    if(depth == 0) return evaluatePosition(board, originalBoard, aiColor);
    for(let i = 0; i < possibilities.length; i++) {
        if(bSearchPv) {
            value = -principalVariationSearch(possibilities[i], originalBoard, depth-1, aiColor, nextColor, -beta, -alpha);
        } else {
            value = -principalVariationSearch(possibilities[i], originalBoard, depth-1, aiColor, nextColor, -alpha-1, -alpha);
        }
        if(value >= beta) return beta;
        if(value > alpha) {
            alpha = value;
            bSearchPv = false;
        }
    }
    return alpha;
}

function evaluatePosition(board: StructFEN, originalBoard: StructFEN, aiColor: string): number {
    let enemy: string = aiColor == "b" ? "w" : "b";
    let pastMaterialEval: number = getMaterial(FENToArray(originalBoard.value), aiColor) - getMaterial(FENToArray(originalBoard.value), enemy);
    let currMaterialEval: number = getMaterial(FENToArray(board.value), aiColor) - getMaterial(FENToArray(board.value), enemy);
    if(currMaterialEval == pastMaterialEval) return 0;
    else return currMaterialEval - pastMaterialEval;
}

function getNextPosition(board: StructFEN, depth: number): StructFEN {
    let possiblePositions: StructFEN[] = generateNextPossiblePositions(board);
    let positionStrength: number[] = [];
    let i: number = 0;
    possiblePositions.forEach(position => {positionStrength[i] = minimax(position, board, depth, position.next, position.next, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER); i++;});
    return depth % 2 == 0 ? possiblePositions[positionStrength.indexOf(Math.max.apply(Math, positionStrength))] : possiblePositions[positionStrength.indexOf(Math.min.apply(Math, positionStrength))];
}