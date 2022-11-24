import React from 'react';
import SlideShow from "../../images/slideShow";

const DataItemImages = ({name,data,sx,category}) => {

    let channel = window.systemCategories.getChannelProperties(category);

    let imagesActual=data;
    if(!data||data.length===0) {
        imagesActual=[channel.image];
    }

    let sxActual={...{
            color: window.systemMain.fontMain,
            fontSize: "1rem"
        },...sx}
    return (
        <SlideShow images={imagesActual} sx={sxActual}></SlideShow>
    )
}

export default DataItemImages;