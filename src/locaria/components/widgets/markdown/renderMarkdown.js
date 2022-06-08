import React from 'react';
import TypographyHeader from "../typography/typographyHeader";
import TypographyParagraph from "../typography/typographyParagraph";
import RenderPlugin from "./renderPlugin";
import Divider from "@mui/material/Divider";


export default function RenderMarkdown({markdown})  {

    let splitMarkdown=markdown.split('\n');
    let renderedMarkdown=[];
    for(let line in splitMarkdown) {

        // Headers IE H1 H2 etc
        let match=splitMarkdown[line].match(/^#+ /);
        if(match) {
            let headerType=match[0].length-1;
            renderedMarkdown.push(
                <TypographyHeader element={"h"+headerType}>{splitMarkdown[line].replace(match[0],'')}</TypographyHeader>
            );
            continue;
        }

        // Plugins our format %%
        match=splitMarkdown[line].match(/^%(.*?)%/);
        if(match) {
            renderedMarkdown.push(
                <RenderPlugin plugin={match[1]}></RenderPlugin>
            );
            continue;
        }

        // HR to <Dividor>
        match=splitMarkdown[line].match(/^----------/);
        if(match) {
            renderedMarkdown.push(
                <Divider/>
            );
            continue;
        }
        renderedMarkdown.push(<TypographyParagraph>{splitMarkdown[line]}</TypographyParagraph>);
    }

    return (
        <>
            {renderedMarkdown}
        </>
    )
}