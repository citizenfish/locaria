import MdSerialize from "../../../libs/mdSerialize";
import {setObjectWithPath} from "../../../libs/objectTools";


export default function FormFieldsToData(category) {

	const MD = new MdSerialize();

	let channel = window.systemCategories.getChannelProperties(category);
	let fields = channel.fields;
	let attribute={
	}

	let element;

	for(let field in fields.main) {
		switch(fields.main[field].display) {
			case 'md':
				element=document.getElementById(fields.main[field].key);
				let obj=MD.parseHTML(element);
				setObjectWithPath(attribute,fields.main[field].key,obj);
				break
			default:
				element=document.getElementById(fields.main[field].key);
				setObjectWithPath(attribute,fields.main[field].key,element.value);
				break;

		}
	}
	return attribute;
}