function decodeSearchParams(search) {
	let aSearch='/'+decodeURI(search)+'/';
	let params={
		limit:30,
		displayLimit: 30,
		subCategories:{subCategory1:[],subCategory2:[]}
	}
	let match=aSearch.match(/\/s(.*?)\//);
	if(match) {
		params.search=match[1];
	}
	match=aSearch.match(/\/l(.*?)\//);
	if(match) {
		params.location=match[1].split(',');
	}
	match=aSearch.match(/\/1(.*?)\//);
	if(match) {
		params.subCategories['subCategory1']=match[1].split(',');
	}
	match=aSearch.match(/\/2(.*?)\//);
	if(match) {
		params.subCategories['subCategory2']=match[1].split(',');
	}
	return params;
}

function encodeSearchParams(params) {

	let search='';
	if(params.search) {
		search+=`/s${params.search}`;
	}
	if(params.location) {
		search+=`/l${params.location[0]},${params.location[1]}`;
	}
	if(params.subCategories&&params.subCategories['subCategory1']&&params.subCategories['subCategory1'].length>0) {
		search+=`/1${params.subCategories['subCategory1'].join(',')}`;
	}
	if(params.subCategories&&params.subCategories['subCategory2']&&params.subCategories['subCategory2'].length>0) {
		search+=`/2${params.subCategories['subCategory2'].join(',')}`;
	}
	return `${search}/`;
}

export {decodeSearchParams,encodeSearchParams};