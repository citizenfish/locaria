import React from 'react';
import FooterTypeSimple from "./footerTypeSimple";



const RenderFooter = () => {

    const footerList = {
        'Simple': <FooterTypeSimple/>
    }

    if (window.systemMain['footerType'] === undefined)
        return footerList['Simple'];
    else
        return footerList[window.systemMain['footerType']];
}

export default RenderFooter;