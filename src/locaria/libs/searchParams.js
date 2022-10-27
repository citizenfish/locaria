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
	return params;
}

export {decodeSearchParams};