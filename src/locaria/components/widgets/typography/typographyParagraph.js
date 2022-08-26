import React from "react";
import Typography from "@mui/material/Typography";

export default function TypographyParagraph({children,sx}) {

    const localSx={
        fontSize: "0.8rem",
        fontWeight: window.systemMain['fontPWeight'],
        paddingTop: "2px",
        paddingBottom: "2px",
        fontFamily: window.systemMain['fontPFont'],
        color: window.systemMain['fontP']
    };

    let elementSx={...localSx,...sx||{}};

    return (
        <Typography variant={"body1"} sx={elementSx}>
            {children}
        </Typography>
    )
}