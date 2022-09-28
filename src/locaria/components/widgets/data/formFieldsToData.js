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

	let element;

	for(let field in fields.main) {
		switch(fields.main[field].display) {
			case 'subCategory':
				if(updates[fields.main[field].key]) {
					let splitPath = updates[fields.main[field].key].split(".");
					setObjectWithPath(attribute, 'data.categoryLevel1', splitPath[0]);
					if(splitPath[1])
						setObjectWithPath(attribute, 'data.categoryLevel2', splitPath[1]);
					if(splitPath[2])
						setObjectWithPath(attribute, 'data.categoryLevel3', splitPath[2]);

				} else {
					console.log(`Could not get element with key ${fields.main[field].key}`);
				}
				break;
			case 'md':
			default:
				//element=document.getElementById(fields.main[field].key);
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