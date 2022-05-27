import React from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";



const LogoStrapLine = () => {

    return (
        <Box sx={{
            width: "calc(100vw - 20px)"
        }}>
            <Grid container>
                <Grid item xs={2} sx={{
                    textAlign: 'center'
                }}>
                    <p>Logo</p>
                </Grid>
                <Grid item xs={10} sx={{
                    textAlign: 'center'
                }}>
                    <p>Strap</p>
                </Grid>

            </Grid>
        </Box>
    )
}

export default LogoStrapLine;