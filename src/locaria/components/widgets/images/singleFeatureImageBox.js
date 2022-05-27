import React from 'react';
import Box from "@mui/material/Box";
import UrlCoder from "../../../libs/urlCoder"



const SingleFeatureImageBox = ({category,image}) => {

    const url = new UrlCoder();

    let channel=window.systemCategories.getChannelProperties(category);
    let imageActual=channel.image;
    if(image)
        imageActual=image;

    return (

            <Box sx={{
                backgroundImage:`url(${url.decode(imageActual,true)})`,
                backgroundSize: "cover",
                width: "calc(100% - 20px)",
                minHeight: "200px"
            }} >
            </Box>
    )
}

export default SingleFeatureImageBox;


