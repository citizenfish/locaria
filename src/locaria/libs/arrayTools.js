function arrayToggleElement(array,element) {
	let index=array.indexOf(element);
	if(index===-1)
		array.push(element);
	else
		array.splice(index,1);
	return array;
}

function findArrayObject(array,key,value) {
	for(let a in array) {
		if(array[a][key]===value) {
			return array[a];
		}
	}
	return undefined;
}

export {arrayToggleElement,findArrayObject};