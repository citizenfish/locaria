import React from "react";
import Typography from "@mui/material/Typography";

export default function TypographyParagraph({children}) {

    return (
        <Typography variant={"body1"} sx={{
            fontSize: "0.7rem",
            paddingTop: "2px",
            paddingBottom: "2px",
            fontFamily: window.systemMain['fontPFont'],
            color: window.systemMain['fontP']
        }}>
            {children}
        </Typography>
    )
}