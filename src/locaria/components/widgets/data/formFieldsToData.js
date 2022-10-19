import React from 'react';


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

	let channel = window.systemCategories.getChannelProperties(category);
	let fields = channel.fields;
	let attribute={
	}


	for(let field in fields.main) {
		switch(fields.main[field].write) {
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