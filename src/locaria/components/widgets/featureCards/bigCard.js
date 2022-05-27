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
            height: "270px",
            border: "1px solid black",
            backgroundColor: channel.color
        }}>

            <Box sx={{
                backgroundImage:`url(${url.decode(image,true)})`,
                backgroundSize: "cover",
                height: "200px"
            }} onClick={()=>{
                history.push(`/View/${props.feature.properties.category}/${props.feature.properties.fid}`);
            }}>

            </Box>
            <Box sx={{
                padding: "5px"
            }}>
                <Typography>
                    {props.feature.properties.description.title}
                </Typography>
            </Box>
        </Box>
    )
}

export default BigCard;


