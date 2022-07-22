import React from "react";
import Typography from "@mui/material/Typography";

export default function TypographyHeader({children,element,sx})  {
    //TODO why is fontSize hardcoded?
    const elements = {
        "h1":{
            fontSize:"1.2rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()],
            fontWeight: window.systemMain['font'+element.toUpperCase()+'Weight'],
            textTransform: window.systemMain['textTransform'+element.toUpperCase()] || 'none',
        },
        "h2":{
            fontSize:"1rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()],
            fontWeight: window.systemMain['font'+element.toUpperCase()+'Weight'],
            textTransform: window.systemMain['textTransform'+element.toUpperCase()] || 'none',

        },
        "h3":{
            fontSize:"0.9rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()],
            fontWeight: window.systemMain['font'+element.toUpperCase()+'Weight'],
            textTransform: window.systemMain['textTransform'+element.toUpperCase()] || 'none',
        },
        "h4":{
            fontSize:"0.8rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()],
            fontWeight: window.systemMain['font'+element.toUpperCase()+'Weight'],
            textTransform: window.systemMain['textTransform'+element.toUpperCase()] || 'none',
        },
        "h5":{
            fontSize:"0.7rem",
            fontFamily: window.systemMain['font'+element.toUpperCase()+'Font'],
            color: window.systemMain['font'+element.toUpperCase()],
            fontWeight: window.systemMain['font'+element.toUpperCase()+'Weight'],
            textTransform: window.systemMain['textTransform'+element.toUpperCase()] || 'none',
        }
    }

    let elementSx={...elements[element],...sx||{}};

    return (
        <Typography variant={element} sx={elementSx}>
            {children}
        </Typography>
    )
}