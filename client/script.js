import * as Util from './util.js'

const BOARD_HEIGHT = 8;
const BOARD_WIDTH = 8;
const TILE_WIDTH = 32;
const TILE_HEIGHT = 32

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
	WHITE_PAWN: 7,
	WHITE_ROOK: 8,
	WHITE_KNIGHT: 9,
	WHITE_BISHOP: 10,
	WHITE_QUEEN: 11,
	WHITE_KING: 12,
});
const PIECE_COUNT = 13;

const EventType = Object.freeze ({
	POINTER_DOWN: 0,
});

const EVENT_SUBSCRIBERS = [
	[handlePointerdown],
];

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

//final constant for storeing data for the peices
//kinda gross
let PIECES = []
PIECES.length = PIECE_COUNT;

async function initPieces() {
	//init stuff
	for(let i = 0; i < PIECE_COUNT; i++) {
		PIECES[i] = {};
	}

	let piecePngs = [];
	piecePngs.length = PIECE_COUNT;
	
	for(let i = 0; i < PIECE_COUNT; i++) {
		if(i != PIECE.EMPTY)
			piecePngs[i] = Util.readImage(PIECES_DATA[i].image) 
	}

	let results = await Promise.all(piecePngs);

	for(let i = 0; i < PIECE_COUNT; i++) {
		if(i != PIECE.EMPTY)
			PIECES[i].image = await piecePngs[i];
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

	let board = await Util.readJson("/board.json");


	return board
}

async function initState() {

	let state = {
		eventQueue: [],
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

	document.addEventListener('pointerdown', (e) => {
		//state.lastTileClicked = getTileClicked(state.canvas, e.pageX, e.pageY);

	
		

		state.eventQueue.push({
			type: EventType.POINTER_DOWN,
			data: {x: e.pageX, y: e.pageY},
		});

		//start(state);
	});

	return state;
}

function getTileClicked(canvas, clickX, clickY) {
	const rect = Util.getPageRect(canvas);
	
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

function start(state) {
	function loop() {
		
		while(state.eventQueue.length > 0) {
			let _event = state.eventQueue.shift();
			
			for(let i = 0; i < EVENT_SUBSCRIBERS[_event.type].length; i++) {
				EVENT_SUBSCRIBERS[_event.type][i](state, _event);

				//console.log(`${_event.type, i}`);
			}


		}
//		update(state);
//		render(state);
		
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
}

function updateBoard(state, _event) {
	//cancles if you clicked outside the board "cancles" (doesn't select anything)
	state.lastTileClicked = getTileClicked(state.canvas, _event.data.x, _event.data.y);

	if(!state.lastTileClicked.inBoard) {
		state.selecting = false;
		return;
	} 

	//cancle if you attempt to click an empty slot and you aren't already selecting another piece it cancles
	if(state.board[state.lastTileClicked.y][state.lastTileClicked.x] === PIECE.EMPTY && state.selecting === false) {
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

function handlePointerdown(state, _event) {
	updateBoard(state, _event);
	render(state);
}

function update(state) {

	//updateBoard(state);
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
	//init();
	await initPieces();

	let state = await initState();

	//let pieces = document.getElementById("pieces");

	console.log(state.num);

	render(state);
	start(state);


}
main();
