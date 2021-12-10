
export default class Pages {

	constructor() {
		this.pages = {};
	}

	listPages() {
		let list=[];
		for (let p in this.pages) {
			if(this.pages[p].options.addToMenu===true) {
				list.push({title:this.pages[p].options.title,page:p})
			}
		}
		return list;
	}

	addPage(id,options,data) {
		options= Object.assign({
			addToMenu:true,
			title:"Page title"
		},options);
		this.pages[id]={
			data:data,
			options:options
		};
	}

	getPageData(id) {
		return this.pages[id].data;
	}
}