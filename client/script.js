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
	CLEAR_BUTTON_PRESSED: 1,
	RESET_BUTTON_PRESSED: 2,
	TRANSFER: 3,
});

const EVENT_SUBSCRIBERS = [
	[handlePointerdown],
	[handleClearButtonPressed],
	[handleResetButtonPressed],
	[handleTransfer],
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

	let board = await Util.readJson("./assets/board.json");


	return board
}

async function initState() {

	let state = {
		eventQueue: [],

		tran: false,
		transfer: null,

		board: {
			canvas: document.getElementById('canvas1'),
			lastTileClicked: {x: 0, y: 0},
			selectedTile: {x: 0, y: 0},
			selecting: false,
		},

		board2: {
			canvas: document.getElementById('canvas2'),
			lastTileClicked: {x: 0, y: 0},
			selectedTile: {x: 0, y: 0},
			selecting: false,
		},

		BOARD: await initBoard(),
		//boardImage: drawBoard(),
		num: 117,
	};
	//board1
	state.board.tileMap = structuredClone(state.BOARD);
	state.board.renderer = state.board.canvas.getContext("2d", {alpha: false}),

	state.board.canvas.width = TILE_WIDTH * BOARD_WIDTH;
	state.board.canvas.height = TILE_HEIGHT * BOARD_HEIGHT;

	//board2
	state.board2.tileMap = await Util.readJson("./assets/board2.json");//structuredClone(state.BOARD);
	state.board2.renderer = state.board2.canvas.getContext("2d", {alpha: false}),

	state.board2.canvas.width = TILE_WIDTH * 2;
	state.board2.canvas.height = TILE_HEIGHT * BOARD_HEIGHT;

	document.addEventListener('pointerdown', (e) => {
		console.log(e.target.id);
		//console.log(e.target.id);

//		let id = 0
//		if(e.target.id === "canvas2") {
//			id = 1;
//		}

		state.eventQueue.push({
			type: EventType.POINTER_DOWN,
			data: {x: e.pageX, y: e.pageY, id: e.target.id},
		});
	});

	document.querySelector('#clear-btn').addEventListener('click', (e) => {
		state.eventQueue.push({
			type: EventType.CLEAR_BUTTON_PRESSED,
			data: {},
		});
	});

	document.querySelector('#reset-btn').addEventListener('click', (e) => {
		state.eventQueue.push({
			type: EventType.RESET_BUTTON_PRESSED,
			data: {},
		});
	});

	return state;
}

function getTileClicked(canvas, clickX, clickY) {
	const rect = Util.getPageRect(canvas);
	
	//calculate tile clickeclickX, clickY

	let pos = {}

	pos.x = Math.floor((clickX - rect.left) / (rect.width / (canvas.width / TILE_WIDTH)));
	pos.y = Math.floor((clickY - rect.top) / (rect.height / (canvas.height / TILE_HEIGHT)));

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

function updateBoard(board, board2, _event) {
	//cancles if you clicked outside the board "cancles" (doesn't select anything)
	board.lastTileClicked = getTileClicked(board.canvas, _event.data.x, _event.data.y);

	if(!board.lastTileClicked.inBoard) {
		board.selecting = false;
		return;
	} 

	if(board2.selecting == true) {
		board.tileMap[board.lastTileClicked.y][board.lastTileClicked.x] = board2.tileMap[board2.selectedTile.y][board.selectedTile.x];

		board2.selecting = false;
		return;
	}

	//cancle if you attempt to click an empty slot and you aren't already selecting another piece it cancles
	if(board.tileMap[board.lastTileClicked.y][board.lastTileClicked.x] === PIECE.EMPTY && board.selecting === false) {
		board.selecting = false;
		return;
	}

	
	if(board.selecting == false) {
		board.selecting = true;
	} else {
		let temp = board.tileMap[board.selectedTile.y][board.selectedTile.x];
		board.tileMap[board.selectedTile.y][board.selectedTile.x] = PIECE.EMPTY;
		board.tileMap[board.lastTileClicked.y][board.lastTileClicked.x] = temp;
		board.selecting = false;
	}

	board.selectedTile = board.lastTileClicked;
}

function updateBoard2(board, _event) {
	if(_event.data.id === "canvas2") {
	//cancles if you clicked outside the board "cancles" (doesn't select anything)
	board.lastTileClicked = getTileClicked(board.canvas, _event.data.x, _event.data.y);

	if(!board.lastTileClicked.inBoard) {
		board.selecting = false;
		return;
	} 

	//cancle if you attempt to click an empty slot and you aren't already selecting another piece it cancles
//	if(board.tileMap[board.lastTileClicked.y][board.lastTileClicked.x] === PIECE.EMPTY && board.selecting === false) {
//		board.selecting = false;
//		return;
//	}
	
	if(board.selecting == false) {
		board.selecting = true;
	} else {
		//let temp = board.tileMap[board.selectedTile.y][board.selectedTile.x];
		//board.tileMap[board.selectedTile.y][board.selectedTile.x] = PIECE.EMPTY;
		//board.tileMap[board.lastTileClicked.y][board.lastTileClicked.x] = temp;
		
		//state.EventQueue.push(
		board.selecting = false;
	}

	board.selectedTile = board.lastTileClicked;
	}
}

function handleTransfer(state, _event) {

}

function handlePointerdown(state, _event) {
	updateBoard(state.board, state.board2, _event);
	updateBoard2(state.board2, _event);
	render(state);
}

function handleClearButtonPressed(state, _event) {
	clear_board(state.board.tileMap);
	render(state);
}

function handleResetButtonPressed(state, _event) {
	state.board.tileMap = structuredClone(state.BOARD);
//	console.log(state.BOARD);
//	console.log(state.board);
//	for(let y = 0; y < state.board.length; y++) {
//		for(let x = 0; x < state.board.length; x++) {
//			state.board[y][x] = state.BOARD[y][x];
//		}
//	}
	render(state);
}

function clear_board(board) {
	for(let y = 0; y < board.length; y++) {
		for(let x = 0; x < board.length; x++) {
			board[y][x] = PIECE.EMPTY;
		}
	}
}

function update(state) {

	//updateBoard(state);
}

function render(state) {
	//state.board.renderer.drawImage(state.boardImage, 0, 0);

	//let canvas = document.createElement("canvas");
	//canvas.width = 256;
	//canvas.height = 256;
	//let renderer = canvas.getContext("2d", {alpha: false});

	//draw background
	for(let y = 0; y < BOARD_HEIGHT; y++) {
		for(let x = 0; x < BOARD_WIDTH; x++) {
			//fill checkerboard pattern
			if((x % 2 == 0) == (y % 2 == 0))
				state.board.renderer.fillStyle = "#e87f23"
			else
				state.board.renderer.fillStyle = "#703602";

			state.board.renderer.fillRect(x*32, y*32, 32, 32);
		}
	}

	for(let y = 0; y < BOARD_HEIGHT; y++) {
		for(let x = 0; x < BOARD_WIDTH; x++) {
			if(state.board.tileMap[y][x] !== PIECE.EMPTY)
 				state.board.renderer.drawImage(PIECES[state.board.tileMap[y][x]].image, x*32, y*32);
		}
	}
		state.board.renderer.fillStyle = "#34ebe5"
		//renderer.fillRect(0,0,50,50);

	if(state.board.selecting) {

		let x = state.board.selectedTile.x;
		let y = state.board.selectedTile.y;
		
		state.board.renderer.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, 2, TILE_HEIGHT);
		state.board.renderer.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, 2);
		state.board.renderer.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT + TILE_HEIGHT - 2, TILE_WIDTH, 2);
		state.board.renderer.fillRect(x * TILE_WIDTH + TILE_WIDTH - 2, y * TILE_HEIGHT, 2, TILE_HEIGHT);
	}

	// epic coding skilz

	//draw background
	for(let y = 0; y < BOARD_HEIGHT; y++) {
		for(let x = 0; x < 2; x++) {
			//fill checkerboard pattern
			if((x % 2 == 0) == (y % 2 == 0))
				state.board2.renderer.fillStyle = "#e87f23"
			else
				state.board2.renderer.fillStyle = "#703602";

			state.board2.renderer.fillRect(x*32, y*32, 32, 32);
		}
	}
	for(let y = 0; y < BOARD_HEIGHT; y++) {
		for(let x = 0; x < 2; x++) {
			if(state.board2.tileMap[y][x] !== PIECE.EMPTY)
 				state.board2.renderer.drawImage(PIECES[state.board2.tileMap[y][x]].image, x*32, y*32);
		}
	}
		state.board2.renderer.fillStyle = "#34ebe5"
		//renderer.fillRect(0,0,50,50);

	if(state.board2.selecting) {

		let x = state.board2.selectedTile.x;
		let y = state.board2.selectedTile.y;
		
		state.board2.renderer.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, 2, TILE_HEIGHT);
		state.board2.renderer.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT, TILE_WIDTH, 2);
		state.board2.renderer.fillRect(x * TILE_WIDTH, y * TILE_HEIGHT + TILE_HEIGHT - 2, TILE_WIDTH, 2);
		state.board2.renderer.fillRect(x * TILE_WIDTH + TILE_WIDTH - 2, y * TILE_HEIGHT, 2, TILE_HEIGHT);
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
