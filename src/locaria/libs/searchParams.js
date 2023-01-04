import {objectPathGet, setObjectWithPath} from "libs/objectTools";

function decodeSearchParams(search) {
	let aSearch='/'+decodeURI(search)+'/';
	let params={
		subCategories:{subCategory1:[],subCategory2:[]}
	}
	let match=aSearch.match(/\/s(.*?)\//);
	if(match) {
		params.search=match[1];
	}

	// Location
	match=aSearch.match(/\/l(.*?)\//);
	if(match) {
		params.location=match[1].split(',');
	}

	// bbox
	match=aSearch.match(/\/b(.*?)\//);
	if(match) {
		params.bbox=match[1].split(',');
	}

	match=aSearch.match(/\/1(.*?)\//);
	if(match) {
		// TODO now in filter which dont encode
		//params.subCategories['subCategory1']=match[1].split(',');
	}
	match=aSearch.match(/\/2(.*?)\//);
	if(match) {
		// TODO now in filter which dont encode
		//params.subCategories['subCategory2']=match[1].split(',');
	}
	match=aSearch.match(/\/d(.*?)\//);
	if(match) {
		params.distance=match[1];
	}
	match=aSearch.match(/\/p(.*?)\//);
	if(match) {
		params.page=parseInt(match[1]);
	}
	match=aSearch.match(/\/t(.*?)\//);
	if(match) {
		params.tags=match[1].split(',');
	}

	// Decode the filters
	match=aSearch.match(/\/f(.*?)\//);
	if(match) {
		params.filters={};
		let filters=match[1].split(',');
		for(let f in filters) {
			let filterDef=filters[f].split('=');
			setObjectWithPath(params.filters,filterDef[0],filterDef[1]);
		}

	}
	// Wait mode?
	match=aSearch.match(/\/w\//);
	if(match) {
		params.wait=true;
	}

	return params;
}

function encodeSearchParams(params,schema) {

	let search='';
	if(params.search) {
		search+=`/s${params.search}`;
	}

	// Add a location array
	if(params.location&&Array.isArray(params.location)&&params.location.length===2) {
		search+=`/l${parseFloat(params.location[0]).toFixed(5)},${parseFloat(params.location[1]).toFixed(5)}`;
	}

	// Add a bbox array
	if(params.bbox&&Array.isArray(params.bbox)&&params.bbox.length===4) {
		search+=`/b${parseFloat(params.bbox[0]).toFixed(7)},${parseFloat(params.bbox[1]).toFixed(7)},${parseFloat(params.bbox[2]).toFixed(7)},${parseFloat(params.bbox[3]).toFixed(7)}`;
	}

	if(params.subCategories&&params.subCategories['subCategory1']&&params.subCategories['subCategory1'].length>0) {
		search+=`/1${params.subCategories['subCategory1'].join(',')}`;
	}
	if(params.subCategories&&params.subCategories['subCategory2']&&params.subCategories['subCategory2'].length>0) {
		search+=`/2${params.subCategories['subCategory2'].join(',')}`;
	}
	if(params.tags&&params.tags.length>0) {
		search+=`/t${params.tags.join(',')}`;
	}
	if(params.distance) {
		search+=`/d${params.distance}`;
	}
	if(params.page) {
		search+=`/p${params.page}`;
	}

	if(params.filters&&schema) {
		let filters=[];
		for(let s in schema) {
			let values = objectPathGet(params.filters, schema[s].path);
			if(values) {
				for (let v in values) {
					filters.push(`${schema[s].path}.${v}=${values[v]}`);
				}
			}
		}
		if(filters.length>0) {
			search += `/f${filters.join(',')}`;
		}

	}

	if(params.wait) {
		search+=`/w`;
	}
	return `${search}/`;
}

export {decodeSearchParams,encodeSearchParams};