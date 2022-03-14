
export default class Pages {

	constructor() {
		this.pages = {};
	}

	listPages() {
		let list=[];
		for (let p in this.pages) {
			if(this.pages[p].options.addToMenu===true) {
				list.push(this.pages[p].options);
			}
		}
		return list;
	}

	addPage(id,options,data) {
		options= Object.assign({
			addToMenu:true,
			title:"Page title",
			type:"page",
			id:id
		},options);
		this.pages[id]={
			data:data,
			options:options
		};
	}

	getPageData(id) {
		return this.pages[id].data;
	}

	getPage(id) {
		return this.pages[id];
	}
}