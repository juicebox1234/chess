//AI function IDK how to do this stuff
export function readImage(url) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = (err) => reject(err);
		img.src = url;
	});
}

//AI
//does getClientRect() but reletive to the top left corner of the page 
//shapes are hard
export function getPageRect(el) {
  const r = el.getBoundingClientRect();

  return {
    left: r.left + scrollX,
    top: r.top + scrollY,
    width: r.width,
    height: r.height
  };
}

//AI function kinda IDK how to do this stuff
export async function readJson(name) {
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
