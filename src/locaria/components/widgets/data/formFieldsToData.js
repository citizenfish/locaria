import React from 'react';


import MdSerialize from "../../../libs/mdSerialize";
import {setObjectWithPath} from "../../../libs/objectTools";


function FormFieldsCheckRequired(updates) {

	for(let field in updates) {
		console.log(updates[field].required);
		if(updates[field].required===true&&updates[field].complete!==true)
			return false;
	}
	return true;
}

function FormFieldsToData(category,updates) {

	const MD = new MdSerialize();
	let channel = window.systemCategories.getChannelProperties(category);
	let fields = channel.fields;
	let attribute={
	}


	for(let field in fields.main) {
		switch(fields.main[field].write) {
			case 'subCategory':
				if(updates[fields.main[field].key]) {
					if(updates[fields.main[field].key].value[0])
						setObjectWithPath(attribute, 'properties.data.categoryLevel1', updates[fields.main[field].key].value[0]);
					if(updates[fields.main[field].key].value[1])
						setObjectWithPath(attribute, 'properties.data.categoryLevel2', updates[fields.main[field].key].value[1]);
					if(updates[fields.main[field].key].value[2])
						setObjectWithPath(attribute, 'properties.data.categoryLevel3', updates[fields.main[field].key].value[2]);

				} else {
					console.log(`Could not get element with key ${fields.main[field].key}`);
				}
				break;
			case 'md':
			default:
				if(updates[fields.main[field].key])
					setObjectWithPath(attribute,fields.main[field].key,updates[fields.main[field].key].value);
				else {
					console.log(`Could not get element with key ${fields.main[field].key}`);
				}
				break;

		}
	}
	return attribute;
}

export {FormFieldsCheckRequired,FormFieldsToData}