import React from "react";
import Typography from "@mui/material/Typography";

export default function TypographyBold({children,sx,id}) {

    const localSx={
        fontSize: "0.8rem",
        paddingTop: "2px",
        paddingBottom: "2px",
        fontFamily: window.systemMain['fontPFont'],
        color: window.systemMain['fontP'],
        fontWeight: "bold"
    };

    let elementSx={...localSx,...sx||{}};

    return (
        <Typography component={"span"} variant={"body2"} sx={elementSx} id={id}>
            {children}
        </Typography>
    )
}