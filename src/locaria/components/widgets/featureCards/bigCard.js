import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UrlCoder from "../../../libs/urlCoder"
import {useHistory} from "react-router-dom";



const BigCard = (props) => {

    const url = new UrlCoder();
    const history = useHistory();

    let channel=window.systemCategories.getChannelProperties(props.feature.properties.category);
    let image=channel.image;
    if(props.feature.properties.data&&props.feature.properties.data.images&&props.feature.properties.data.images[0])
        image=props.feature.properties.data.images[0];
    return (
        <Box sx={{
            backgroundColor: channel.color,
            width: "100%"
        }}>

            <Box sx={{
                backgroundImage:`url(${url.decode(image,true)})`,
                backgroundSize: "cover",
                height: { md: "150px", xs: "250px"},
                width: "100%"

            }} onClick={()=>{
                history.push(`/${channel.page||'View'}/fp/${props.feature.properties.category}/${props.feature.properties.fid}`);
            }}>

            </Box>
            <Box sx={{
                padding: "5px",
                height: "50px"
            }}>
                <Typography>
                    {props.feature.properties.description.title}
                </Typography>
            </Box>
        </Box>
    )
}

export default BigCard;


