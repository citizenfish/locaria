import React from 'react';
import TopFeatures from "../search/topFeatures";
import PageList from "../pages/pageList";
import ContactFull from "../contact/contactFull";
import FooterTypeSimple from "../footers/footerTypeSimple";
import NavTypeSimple from "../navs/navTypeSimple";
import SiteMap from "../pages/siteMap";
import LogoStrapLine from "../logos/logoStrapLine";
import ViewFullDetails from "../viewLayouts/viewFullDetails";

export default function RenderPlugin({plugin}) {

    const pluginMatch=plugin.match(/^([a-zA-Z]*)\s{0,1}/);

    let pluginId=pluginMatch[1];
    let pluginArgStr=plugin.replace(pluginMatch[0],'');

    const plugins={
        "TopFeatures":TopFeatures,
        "PageList":PageList,
        "ContactFull":ContactFull,
        "FooterTypeSimple":FooterTypeSimple,
        "NavTypeSimple":NavTypeSimple,
        "SiteMap":SiteMap,
        "LogoStrapLine":LogoStrapLine,
        "ViewFullDetails":ViewFullDetails
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