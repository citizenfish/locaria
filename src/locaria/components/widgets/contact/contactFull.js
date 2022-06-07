import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {setAdminLanguageValue} from "../../admin/redux/slices/adminLanguageDrawerSlice";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";

import UrlCoder from "../../../libs/urlCoder";
import Box from "@mui/material/Box";
const url=new UrlCoder();

const ContactFull = () => {

    const [name,setName]= useState("");
    const [email,setEmail]= useState("");
    const [submitted,setSubmitted]= useState(false)


    useEffect(() =>{

        window.websocket.registerQueue("addMessage", function(json){
            setSubmitted(true)
        })
    },[])

    const handleSubmit = (event) => {
        event.preventDefault()
        let packet = {
            queue: "addMessage",
            api: "api",
            data: {
                method: "add_message",
                attributes: {type: "contact"},
                message : {
                    email: email,
                    name: name,
                    message: "Contact form"
                }
            }
        };
        window.websocket.send(packet);
    }



    return (
        <Grid container spacing={2} sx={{
            margin: "10px"
        }}>
            <Grid item md={4} sx={{
                textAlign: "left"
            }}>
                <Typography variant="h3" sx={{
                    fontSize: "1.2rem",
                    fontWeight: "700",
                    paddingBottom: "5px",
                    color: window.systemMain.fontH3

                }}>
                        Contact Us
                </Typography>
                <Typography variant="p" sx={{
                    fontSize: "1rem",
                    color: window.systemMain.fontP

                }}>
                    {window.systemLang.addressLine}
                </Typography>

            </Grid>
            <Grid item md={4} sx={{
                textAlign: "left"
            }}>
                {!submitted &&
                    <>
                    <Typography variant="h2" sx={{
                        fontSize: "1.2rem",
                        fontWeight: "700",
                        paddingBottom: "5px",
                        color: window.systemMain.fontH2
                    }}>
                        {window.systemLang.contactTitle}
                    </Typography>
                    <Typography variant="h3" sx={{
                    fontSize: "1rem",
                    color: window.systemMain.fontH3

                }}>
                {window.systemLang.contactSubHeading}
                    </Typography>

                    <TextField
                    id={"contactName"}
                    label={"Your name"}
                    fullWidth={true}
                    value={name}
                    onChange={(e) => {
                    setName(e.target.value);
                }}
                    />

                    <TextField
                    id={"contactEmail"}
                    label={"Your email"}
                    fullWidth={true}
                    value={email}
                    onChange={(e) => {
                    setEmail(e.target.value);
                }}
                    />

                    <Button variant={"contained"} onClick={(e)=>{
                    handleSubmit(e);
                }}>
                    Submit
                    </Button>
                </>}
                {submitted &&
                    <>
                        <Typography variant="h2" sx={{
                            fontSize: "1rem",
                            color: window.systemMain.fontH2
                        }}>
                            Submitted
                        </Typography>
                    </>
                }
            </Grid>
            <Grid item md={4} sx={{
                textAlign: "left"
            }}>
                <Box sx={{

                    width: "calc( 100% - 40px)",
                    padding: "20px"
                }}>
                    <img src={url.decode(window.systemMain.siteLogo,true)}/>
                </Box>

            </Grid>

        </Grid>
    );
}

export default ContactFull;