
function setObjectWithPath(obj,path,value) {
	let ptr=obj;
	let pathArray=path.split(".");
	for(let i=0;i<pathArray.length-1;i++) {
		if(ptr[pathArray[i]]===undefined) {
			ptr[pathArray[i]]={};
		}
		ptr=ptr[pathArray[i]];
	}
	ptr[pathArray[pathArray.length-1]]=value;
}

export {setObjectWithPath};