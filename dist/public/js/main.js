
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
    return `assets/${pieceId}.png`;
}