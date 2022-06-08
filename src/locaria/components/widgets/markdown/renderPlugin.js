import React from 'react';
import TopFeatures from "../search/topFeatures";

export default function RenderPlugin({plugin}) {


    let pluginId=plugin.match(/^(.*?) /)[1];
    let pluginArgStr=plugin.replace(pluginId+' ','');

    const plugins={
        "TopFeatures":TopFeatures
    }

    if(plugins[pluginId]) {
        let PluginComponent = plugins[pluginId];
        let matchArgs=pluginArgStr.match(/(?:[^\s"]+|"[^"]*")+/g);
        let pluginArgs={};
        for(let a in matchArgs) {
            let cmdArray=matchArgs[a].split('=');
            pluginArgs[cmdArray[0]]=eval(cmdArray[1].replace(/\\"/,'"'));
        }
        return (
            <PluginComponent {...pluginArgs}/>
        )
    } else {
        return (<h1>NO SUCH Component {pluginId}</h1>)
    }

}