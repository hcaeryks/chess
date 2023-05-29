
var cellElementOriginal;

// Função que inicia o drag na peça selecionada pelo user
function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    const imgElement = document.getElementById(event.target.id);
    cellElementOriginal = imgElement.parentNode;
    console.log(cellElementOriginal);
}

// Função onde poderá ser adicionada lógica que verificará se a peça pode ser solta na célula
function allowDrop(event) {
    console.log("Allow drop?");
    event.preventDefault();
}

// Função que realiza o drop da peça na nova célula e remove peça da célula antiga
function drop(event) {
    event.preventDefault();
    var pieceId = event.dataTransfer.getData("text/plain");
    var cellId = event.target.id;
    let imgOriginal = cellElementOriginal.querySelector('img');
    cellElementOriginal.removeChild(imgOriginal);

    // Realiza a lógica necessária para mover a peça para a célula de destino
    const cellElement = document.getElementById(cellId);
    const imageElement = new Image();
    imageElement.src = getImageUrl(pieceId);
    imageElement.id = pieceId;
    imageElement.draggable = 'true';
    imageElement.ondragstart = 'drag(event)';
    imageElement.alt = pieceId;
    imageElement.addEventListener("dragstart", drag);
    cellElement.appendChild(imageElement);
}

// Função que retorna a string 
function getImageUrl(pieceId) {
    return `../assets/${pieceId}.png`;
}

class ChessBoard {
    constructor() {
      // Cria uma matriz 8x8 para representar o tabuleiro
      this.board = new Array(8).fill(null).map(() => new Array(8).fill(null));
  
      // Inicializa o tabuleiro com as peças na posição inicial
      this.initializeBoard();
    }
  
    initializeBoard() {
      // Peças pretas
      this.board[0][0] = new Piece("blackRook");
      this.board[0][1] = new Piece("blackKnight");
      this.board[0][2] = new Piece("blackBishop");
      this.board[0][3] = new Piece("bQ");
      this.board[0][4] = new Piece("bK");
      this.board[0][5] = new Piece("bB");
      this.board[0][6] = new Piece("bN");
      this.board[0][7] = new Piece("bR");
  
      for (let i = 0; i < 8; i++) {
        this.board[1][i] = new Piece("bP");
      }
  
      // Peças brancas
      this.board[7][0] = new Piece("wR");
      this.board[7][1] = new Piece("wN");
      this.board[7][2] = new Piece("wB");
      this.board[7][3] = new Piece("wQ");
      this.board[7][4] = new Piece("wK");
      this.board[7][5] = new Piece("wB");
      this.board[7][6] = new Piece("wN");
      this.board[7][7] = new Piece("wR");
  
      for (let i = 0; i < 8; i++) {
        this.board[6][i] = new Piece("wP");
      }
    }
}

class Piece {
    constructor(type, color, x, y, image) {
      this.type = type;
      this.color = color;
      this.x = x;
      this.y = y;
      this.image = image;
    }
  
  }


document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('chessboard');
    const context = canvas.getContext('2d');

    const pieceImages = {
      whiteKing: '/assets/whiteKing.png',
      whiteQueen: '/assets/whiteQueen.png',
      whiteRook: '/assets/whiteRook.png',
      whiteBishop: '/assets/whiteBishop.png',
      whiteKnight: '/assets/whiteKnight.png',
      whitePawn: '/assets/whitePawn.png',
      blackKing: '/assets/blackKing.png',
      blackQueen: '/assets/blackQueen.png',
      blackRook: '/assets/blackRook.png',
      blackBishop: '/assets/blackBishop.png',
      blackKnight: '/assets/blackKnight.png',
      blackPawn: '/assets/blackPawn.png'
    };
  
    function drawChessboard() {
      const squareSize = canvas.width / 8;
      let isWhiteSquare = true;
  
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const x = col * squareSize;
          const y = row * squareSize;
  
          context.fillStyle = isWhiteSquare ? '#f8f9fa' : '#007bff';
          context.fillRect(x, y, squareSize, squareSize);
          isWhiteSquare = !isWhiteSquare;
        }
        isWhiteSquare = !isWhiteSquare;
      }
    }
  
    function drawPieces() {
        const pieceSize = canvas.width / 8;
      
        // Array com a ordem das peças em uma linha
        const piecesOrder = ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"];
      
        // Array com as cores das peças em uma linha
        const pieceColors = ["black", "black", "black", "black", "black", "black", "black", "black"];
      
        // Loop para desenhar as peças nas posições corretas
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const x = col * pieceSize;
            const y = row * pieceSize;
      
            // Verifica se a posição atual é uma casa de peão
            if (row === 1 || row === 6) {
              const pieceType = "Pawn";
              const pieceColor = (row === 1) ? "black" : "white";
              const img = new Image();
              img.src = pieceImages[`${pieceColor}${pieceType}`];
              img.onload = function() {
                context.drawImage(img, x, y, pieceSize, pieceSize);
              };
            }
            // Verifica se a posição atual é uma casa de outra peça
            else if (row === 0) {
              const pieceType = piecesOrder[col];
              const pieceColor = pieceColors[col];
              const img = new Image();
              img.src = pieceImages[`${pieceColor}${pieceType}`];
              img.onload = function() {
                context.drawImage(img, x, y, pieceSize, pieceSize);
              };
            }

            else if (row === 7) {
              const pieceType = piecesOrder[col];
              const pieceColor = "white";
              const img = new Image();
              img.src = pieceImages[`${pieceColor}${pieceType}`];
              img.onload = function() {
                context.drawImage(img, x, y, pieceSize, pieceSize);
              };
            }
          }
        }
    }
  
    function drawChessGame() {
      drawChessboard();
      drawPieces();
    }
  
    drawChessGame();
});
