function shuffle(str) {
	let result = Array.from(str);
	for(let i = str.length - 1; i > 0; i--) {
		let swapIndex = Math.trunc(Math.random() * i)

		let temp = result[i]
		result[i] = result[swapIndex]
		result[swapIndex] = temp
	}
	return result.join('')
}

a = document.getElementById('fund');

a.innerText = shuffle('youtube');
