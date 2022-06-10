import React from 'react';
import NavTypeFull from "./navTypeFull";
import NavTypeSimple from "./navTypeSimple";



const RenderNav = () => {

    const navList = {
        'Full': <NavTypeFull/>,
        'Simple': <NavTypeSimple/>
    }

    if (window.systemMain['navType'] === undefined)
        return navList['Full'];
    else
        return navList[window.systemMain['navType']];
}

export default RenderNav;