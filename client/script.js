const BOARD_HEIGHT = 8;
const BOARD_WIDTH = 8;
const TILE_WIDTH = 32;
const TILE_HEIGHT = 32
const PIECE_COUNT = 13;

//ids for each peice 
//enum
const PIECE = Object.freeze ({
	PAWN: 0,
	ROOK: 1,
	KNIGHT: 2,
	BISHOP: 3,
	QUEEN: 4,
	KING: 5,
	EMPTY: 6,
	PAWN: 7,
	ROOK: 8,
	KNIGHT: 9,
	BISHOP: 10,
	QUEEN: 11,
	KING: 12,
});

//peice data
const PIECES_DATA = Object.freeze ([
	{image: "./assets/textures/pawn.png"},
	{image: "./assets/textures/rook.png"},
	{image: "./assets/textures/knight.png"},
	{image: "./assets/textures/bishop.png"},
	{image: "./assets/textures/queen.png"},
	{image: "./assets/textures/king.png"},
	{},
	{image: "./assets/textures/white_pawn.png"},
	{image: "./assets/textures/white_rook.png"},
	{image: "./assets/textures/white_knight.png"},
	{image: "./assets/textures/white_bishop.png"},
	{image: "./assets/textures/white_queen.png"},
	{image: "./assets/textures/white_king.png"},
]);

let PIECES = []
PIECES.length = PIECE_COUNT;

async function initPieces() {
	//init stuff
	for(let i = 0; i < PIECE_COUNT; i++) {
		PIECES[i] = {};
	}

	piecePngs = [];
	piecePngs.length = PIECE_COUNT;
	
	for(let i = 0; i < PIECE_COUNT; i++) {
		if(i != PIECE.EMPTY)
			piecePngs[i] = readImage(PIECES_DATA[i].image) 
	}

	results = await Promise.all(piecePngs);

	for(let i = 0; i < PIECE_COUNT; i++) {
		if(i != PIECE.EMPTY)
			PIECES[i].image = await piecePngs[i];
	}
}


function init() {
}

//AI function IDK how to do this stuff
function readImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = (err) => reject(err);
		img.src = url;
	});
}

//AI function kinda IDK how to do this stuff
async function readJson(name) {
	try {
		const response = await fetch('./assets/board.json');
		if (!response.ok) {
			throw new Error(`HTTP error status:${response.status}`)
		} 

		const json = await response.json();

		return json;
	} catch(err) {
		throw err;
	}
}

function drawBoard() {
	//const element = document.querySelector('#canvas');

	//console.log(absoluteX + " " + absoluteY);
	let canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	let renderer = canvas.getContext("2d", {alpha: false});

	for(let y = 0; y < BOARD_HEIGHT; y++) {
		for(let x = 0; x < BOARD_WIDTH; x++) {
			//fill checkerboard pattern
			if((x % 2 == 0) == (y % 2 == 0))
				renderer.fillStyle = "#e87f23"
			else
				renderer.fillStyle = "#703602";

			renderer.fillRect(x*32, y*32, 32, 32);
		}
	}

	return canvas;
}

async function initBoard() {
	//let board = [];

	//initalize array
//	board.length = 8;
//
//	for(int i = 0; i < board.length; i++) {
//		board[i] = [];
//		board[i].length = 8;
//		
//		for(int x = 0; x < 8; x++) {
//			
//		}
//	}

	let board = await readJson("/board.json");

	//console.log(board);
	//console.log("hello");


	return board
}

//helper
//pass a PointerDownEvent
function getCoordsInsideTarget(e) {
	//e.pageX + 
}

const BoardGuiState  ={
	IDLE: 0,
	SELECTED: 1,
}

async function initState() {

	let state = {
		
		lastTileClicked: {x: 0, y: 0},
		selectedTile: {x: 0, y: 0},
		selecting: false,

		board: await initBoard(),
		boardImage: drawBoard(),
		canvas: document.getElementById('canvas'),
		renderer: canvas.getContext("2d", {alpha: false}),
		num: 117,
	};

	state.canvas.width = TILE_WIDTH * BOARD_WIDTH;
	state.canvas.height = TILE_HEIGHT * BOARD_HEIGHT;

	//state.element = document.getElementById('piece');

	document.addEventListener('pointerdown', (e) => {
		state.lastTileClicked = getTileClicked(state.canvas, e.pageX, e.pageY);
		
		start(state);
	});

	document.addEventListener('pointerdown', (e) => {
		//console.log(e);
		const rect = getPageRect(state.canvas);
		
		//calculate tile clicked
		let tileX = Math.trunc((e.pageX - rect.left) / (rect.width / BOARD_WIDTH));
		let tileY = Math.trunc((e.pageY - rect.top) / (rect.height / BOARD_HEIGHT));


		//console.log(tileX+ " " +  tileY  + "  :" + state.canvas.style.height);

		//bounds checking
		/*if(tileX < 0 || tileX >= BOARD_WIDTH || tileY < 0 || tileY >= BOARD_HEIGHT) {
			console.log("aaaj");
			state.selecting = false;
			start(state);
			return;
		}

		if(state.selecting === false && state.board[tileY][tileX] == PIECE.EMPTY) {
			start(state);
			return;
		}

		if(state.selecting === true && tileY == state.selectedTile.y  && tileX == state.selectedPiece.x) {
			state.selecting = false;
			start(state);
			return;
		}

		if(state.selecting === true) {
			state.board[tileY][tileX] = state.board[state.selectedTile.y][state.selectedPiece.x];
			state.board[state.selectedTile.y][state.selectedPiece.x] = PIECE.EMPTY;
			state.selecting = false;
			start(state);
		}
		else if (!(tileX < 0 || tileX >= BOARD_WIDTH || tileY < 0 || tileY >= BOARD_HEIGHT)) {
			state.selectedTile = {
				x: tileX,
				y: tileY,
			};

			state.selecting = true;
			start(state);
		} */

	});

	

	return state;
}

function getTileClicked(canvas, clickX, clickY) {
	const rect = getPageRect(canvas);
	
	//calculate tile clickeclickX, clickY

	let pos = {}

	pos.x = Math.floor((clickX - rect.left) / (rect.width / BOARD_WIDTH));
	pos.y = Math.floor((clickY - rect.top) / (rect.height / BOARD_HEIGHT));

	//stores weather the user clicked inside the board or outside the board
	if (pos.x < 0 || pos.x >= BOARD_WIDTH || pos.y < 0 || pos.y >= BOARD_HEIGHT) {
		pos.inBoard = false
	} else {
		pos.inBoard = true;
	}

	return pos;
}

//AI
//does getClientRect() but reletive to the top left corner of the page 
//shapes are hard
function getPageRect(el) {
  const r = el.getBoundingClientRect();

  return {
    left: r.left + scrollX,
    top: r.top + scrollY,
    width: r.width,
    height: r.height
  };
}

function start(state) {

	//console.count("started");

	function loop() {
		update(state);
		render(state);
		
		//requestAnimationFrame(loop);
	}
	loop();
	//requestAnimationFrame(loop);
}

function updateBoard(state) {
	//cancle if you attempt to click an empty slot and you aren't already selecting another piece it cancles
	if(state.board[state.lastTileClicked.y][state.lastTileClicked.x] === PIECE.EMPTY && state.selecting === false) {
		state.selecting = false;
		return;
	}

	//cancles if you clicked outside the board "cancles" (doesn't select anything)
	if(!state.lastTileClicked.inBoard) {
		state.selecting = false;
		return;
	} 
	
	if(state.selecting == false) {
		state.selecting = true;
	} else {
		let temp = state.board[state.selectedTile.y][state.selectedTile.x];
		state.board[state.selectedTile.y][state.selectedTile.x] = PIECE.EMPTY;
		state.board[state.lastTileClicked.y][state.lastTileClicked.x] = temp;
		state.selecting = false;
	}

	state.selectedTile = state.lastTileClicked;
}

function tilePosEqual(a, b) {
	return (a.x === b.x && a.y === b.y);
}

function update(state) {
	updateBoard(state);
}

function render(state) {
	state.renderer.drawImage(state.boardImage, 0, 0);

	for(let y = 0; y < BOARD_HEIGHT; y++) {
		for(let x = 0; x < BOARD_WIDTH; x++) {
			if(state.board[y][x] !== PIECE.EMPTY)
 				state.renderer.drawImage(PIECES[state.board[y][x]].image, x*32, y*32);
		}
	}
		state.renderer.fillStyle = "#34ebe5"
		//renderer.fillRect(0,0,50,50);

	if(state.selecting) {

		let x = state.selectedTile.x;
		let y = state.selectedTile.y;
		
		state.renderer.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, 2, TILE_HEIGHT);
		state.renderer.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, 2);
		state.renderer.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT + TILE_HEIGHT - 2, TILE_WIDTH, 2);
		state.renderer.fillRect(x * TILE_WIDTH + TILE_WIDTH - 2, y * TILE_HEIGHT, 2, TILE_HEIGHT);
	}
}


async function main() {
	init();
	await initPieces();

	let state = await initState();

	//let pieces = document.getElementById("pieces");

	console.log(state.num);

	start(state);


}
main();


