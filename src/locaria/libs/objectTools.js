
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

function objectPathExists(obj,path) {
	path=`obj.${path}`;
	let result=undefined;
	try {
		result=eval(path);
	} catch (e) {
		return false;
	}
	if(result===undefined)
		return false;
	return true;
}

function objectPathGet(obj, path) {
	if(objectPathExists(obj,path)) {
		path=`obj.${path}`;
		return eval(path);
	}
	return undefined;

}

export {setObjectWithPath,objectPathExists,objectPathGet};