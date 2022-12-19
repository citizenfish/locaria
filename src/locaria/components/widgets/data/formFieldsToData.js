import React from 'react';


import {setObjectWithPath} from "../../../libs/objectTools";


function FormFieldsCheckRequired(updates) {

	for(let field in updates) {
		//console.log(updates[field].required);
		if(updates[field].required===true&&updates[field].complete!==true)
			return false;
	}
	return true;
}

function FormFieldsToData(category,updates,fields) {

	let channel = window.systemCategories.getChannelProperties(category);
	//let fields = channel.fields;
	let attribute={
	}


	for(let field in fields) {
		switch(fields[field].write) {
			default:
				if(updates&&updates[fields[field].key])
					setObjectWithPath(attribute,fields[field].key,updates[fields[field].key].value);
				else {
					console.log(`Could not get element with key ${fields[field].key}`);
				}
				break;

		}
	}
	return attribute;
}

export {FormFieldsCheckRequired,FormFieldsToData}