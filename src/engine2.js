/* important notes: 
    bottom left corner of the board is [1,1]
    black pieces are UPPERCASE and white pieces are lowercase
    pawn = p|P, knight = n|N, bishop = b|B, rook = r|R, queen = q|Q, king = k|K
*/



let board = [["R","N","B","Q","K","B","N","R"],["P","P","P","P","P","P","P","P",],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],["p","p","p","p","p","p","p","p",],["r","n","b","q","k","b","n","r"]];
//let board = [[" "," "," ","b"," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," ","Q"," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "],[" "," "," "," "," "," "," "," "]];
board.forEach(line => console.log(line.toString()));
const engine = new Engine(board,0);
board = engine.nextMove(board).forEach(line => console.log(line.toString()));
board = engine.nextMove(board).forEach(line => console.log(line.toString()));
board = engine.nextMove(board).forEach(line => console.log(line.toString()));
board = engine.nextMove(board).forEach(line => console.log(line.toString()));
board = engine.nextMove(board).forEach(line => console.log(line.toString()));
board = engine.nextMove(board).forEach(line => console.log(line.toString()));
board = engine.nextMove(board).forEach(line => console.log(line.toString()));
board = engine.nextMove(board).forEach(line => console.log(line.toString()));
board = engine.nextMove(board).forEach(line => console.log(line.toString()));
board = engine.nextMove(board).forEach(line => console.log(line.toString()));