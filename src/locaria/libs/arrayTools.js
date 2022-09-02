function arrayToggleElement(array,element) {
	let index=array.indexOf(element);
	if(index===-1)
		array.push(element);
	else
		array.splice(index,1);
	return array;
}

export {arrayToggleElement};