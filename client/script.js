function init() {
	document.querySelectorAll(".piece-img").forEach(el => {
		el.draggable = false;
	});

	let pieces = document.getElementById("pieces");

	pieces.addEventListener('pointerdown', (e) => {
		if(e.target.classList.contains("piece")) {
			console.log("999");
		}
	})
}

function initState() {
	let state = {
		x: 0,
		y: 30,
		isclicked: false,
		element: undefined,
	};

	state.element = document.getElementById('piece');

	return state;
}

function start(state) {

	function loop() {
		update(state);
		render(state);
		
		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
}

function update(state) {
	state.x += 5;
	state.y *= 1.1;
}

function render(state) {
//		let newX = Math.trunc(state.x);
//		let newY = Math.trunc(state.y);

		let newX = state.x;
		let newY = state.y;

		state.element.style.transform = `translate(${newX}px, ${newY}px)`;
		//state.element.style.left = `${state.x}px`;
}


function main() {
	init();

	let state = initState();

	let pieces = document.getElementById("pieces");

	start(state);


}
main();


