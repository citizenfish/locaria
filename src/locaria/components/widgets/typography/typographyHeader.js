import React from "react";
import Typography from "@mui/material/Typography";

export default function TypographyHeader({children,element,sx})  {

    const elements = {
        "h1":{
            fontSize:"1.2rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()],
            fontWeight: window.systemMain['font'+element.toUpperCase()+'Weight']
        },
        "h2":{
            fontSize:"1rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()],
            fontWeight: window.systemMain['font'+element.toUpperCase()+'Weight']

        },
        "h3":{
            fontSize:"0.9rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()],
            fontWeight: window.systemMain['font'+element.toUpperCase()+'Weight']
        },
        "h4":{
            fontSize:"0.8rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()]
        },
        "h5":{
            fontSize:"0.7rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()]
        }
    }

    let elementSx={...elements[element],...sx||{}};

    return (
        <Typography variant={element} sx={elementSx}>
            {children}
        </Typography>
    )
}