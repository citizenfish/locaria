import React from 'react';

import pluginsDefs from "./pluginsDef"
export default function RenderPlugin({plugin,args}) {

	if (pluginsDefs[plugin]&&pluginsDefs[plugin].obj) {
		let PluginComponent = pluginsDefs[plugin].obj;
		return (
				<PluginComponent {...args}/>

		)
	} else {
		return (<h1 key={"renderError"}>NO SUCH Component {plugin}</h1>)
	}

}