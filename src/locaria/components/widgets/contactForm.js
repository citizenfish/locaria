import React, {useEffect, useState} from 'react';
import { Grid, TextField, Button, Card, CardContent, Typography } from '@mui/material';

const ContactForm = () => {

    const [submitted,setSubmitted]= useState(false)
    const [email,setEmail] = useState('')
    const [name,setName] = useState('')
    const [message,setMessage] = useState('')
    const [messageId,setMessageId] = useState(null)

    useEffect(() =>{

        window.websocket.registerQueue("addMessage", function(json){
            setMessageId(json.packet.id)
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
                    message: message
               }
            }
        };
        window.websocket.send(packet);
    }

    if(submitted) {
        return(
            <div>
                <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5">
                            {window.systemLang.contactFormSubmittedTitle}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
                            {window.systemLang.contactFormSubmittedText}
                        </Typography>
                        {
                            messageId &&
                            <Typography gutterBottom variant="h5">
                                window.systemLang.contactFormMessageIdText}:{messageId}
                            </Typography>
                        }
                        <Button>Close</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <Grid>
                <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5">
                            {window.systemLang.contactFormTitle}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
                            {window.systemLang.contactFormText}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid xs={12} sm={12} item>
                                    <TextField value={name}
                                               onInput={e=>setName(e.target.value)}
                                               placeholder={window.systemLang.contactFormNameLabel} label={window.systemLang.contactFormNameLabel} variant="outlined" fullWidth required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField value={email}
                                               onInput={e=>setEmail(e.target.value)}
                                               type="email" placeholder={window.systemLang.contactFormEmailLabel} label={window.systemLang.contactFormEmailLabel} variant="outlined" fullWidth required />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField value={message}
                                               onInput={e=>setMessage(e.target.value)}
                                               label={window.systemLang.contactFormMessageLabel} multiline rows={8} placeholder={window.systemLang.contactFormMessageLabel}variant="outlined" fullWidth required />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>{window.systemLang.contactFormSubmitLabel}</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </div>
    );
}

export default ContactForm