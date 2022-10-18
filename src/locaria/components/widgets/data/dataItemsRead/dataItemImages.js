import React from 'react';
import SlideShow from "../../images/slideShow";

const DataItemImages = ({name,data,sx}) => {
    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}
    return (
        <SlideShow images={data} sx={sxActual}></SlideShow>
    )
}

export default DataItemImages;