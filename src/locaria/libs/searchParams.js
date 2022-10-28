function decodeSearchParams(search) {
	let aSearch='/'+search+'/';
	let params={
		limit:30,
		displayLimit: 30,
	}
	let match=aSearch.match(/\/s(.*?)\//);
	if(match) {
		params.search=match[1];
	}
	match=aSearch.match(/\/l(.*?)\//);
	if(match) {
		params.location=match[1].split(',');
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
	return `${search}/`;
}

export {decodeSearchParams,encodeSearchParams};