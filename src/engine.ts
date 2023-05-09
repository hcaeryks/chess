function minimax(board: string[][], depth: number, aiColor: string, color: string) {
    let value: number = 0;
    let nextColor: string = color == "b" ? "w" : "b";
    let enemy: string = aiColor == "b" ? "w" : "b";
    if(depth == 0) return getMaterial(board, aiColor) - getMaterial(board, enemy);
    else if(aiColor != color) {
        value = Number.MAX_SAFE_INTEGER;
        
        return value;
    } else {
        value = Number.MIN_SAFE_INTEGER;

        return value;
    }
}