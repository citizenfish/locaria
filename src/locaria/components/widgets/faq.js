import React, {useState} from 'react';

import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";


const FAQ = (props) => {

    const classes = useStyles();
    const [faqs,setFaqs] = useState(props.faqs || window.systemLang.faqs)

    return(
        <div>
            <Typography varient={"h3"} className={classes.faqTitle}>
                {window.systemLang.faqTitle}
            </Typography>
            {
                faqs.map((faq) =>

                    <Accordion>
                        <AccordionSummary>
                            <Typography className={classes.faqTitleText}>{faq.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {faq.text}
                        </AccordionDetails>
                    </Accordion>
                )
            }

        </div>
    )

}

export default FAQ