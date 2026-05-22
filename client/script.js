const BOARD_HEIGHT = 8;
const BOARD_WIDTH = 8;
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
	{image: "./assets/textures/pawn.png", has_image: true},
	{image: "./assets/textures/rook.png", has_image: true},
	{image: "./assets/textures/knight.png", has_image: true},
	{image: "./assets/textures/bishop.png", has_image: true},
	{image: "./assets/textures/queen.png", has_image: true},
	{image: "./assets/textures/king.png", has_image: true},
	{has_image: false},
	{image: "./assets/textures/white_pawn.png", has_image: true},
	{image: "./assets/textures/white_rook.png", has_image: true},
	{image: "./assets/textures/white_knight.png", has_image: true},
	{image: "./assets/textures/white_bishop.png", has_image: true},
	{image: "./assets/textures/white_queen.png", has_image: true},
	{image: "./assets/textures/white_king.png", has_image: true},
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
		if(PIECES_DATA[i].has_image == true)
			piecePngs[i] = readImage(PIECES_DATA[i].image) 
	}

	results = await Promise.all(piecePngs);

	for(let i = 0; i < PIECE_COUNT; i++) {
		if(PIECES_DATA[i].has_image == true)
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

async function initState() {

	let state = {
		board: await initBoard(),
		boardImage: drawBoard(),
		canvas: document.getElementById('canvas'),
		renderer: canvas.getContext("2d", {alpha: false}),
		num: 117,
	};

	state.canvas.width = 256;
	state.canvas.height = 256;

	//state.element = document.getElementById('piece');


	return state;
}

function start(state) {

	//console.count("started");

	function loop() {
		update(state);
		render(state);
		
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
}

function update(state) {
}

function render(state) {
	state.renderer.drawImage(state.boardImage, 0, 0);

	for(let y = 0; y < BOARD_HEIGHT; y++) {
		for(let x = 0; x < BOARD_WIDTH; x++) {
			//fill checkerboard pattern
			//if((x % 2 == 0) == (y % 2 == 0))
				//state.renderer.fillStyle = "rgb(179, 94, 9)";
				//state.renderer.fillStyle = "#e87f23"
			//else
				//state.renderer.fillStyle = "#703602";

			//console.log((y * BOARD_HEIGHT + x));
			//state.renderer.fillRect(x*32, y*32, 32, 32);
			//console.log(state.board.length + " " + state.board[0].length);

			//if(PIECES_DATA[state.board[y][x]].has_image)
			if(state.board[y][x] !== PIECE.EMPTY)
 				state.renderer.drawImage(PIECES[state.board[y][x]].image, x*32, y*32);

			//state.renderer.drawImage(PIECES[0].image, x*32, y*32);

			//console.log(PIECES[0].image);
			//abort();
		}
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


