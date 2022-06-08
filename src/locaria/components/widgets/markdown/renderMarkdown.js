import React from 'react';
import TypographyHeader from "../typography/typographyHeader";
import TypographyParagraph from "../typography/typographyParagraph";
import RenderPlugin from "./renderPlugin";


export default function RenderMarkdown({markdown})  {

    let splitMarkdown=markdown.split('\n');
    let renderedMarkdown=[];
    for(let line in splitMarkdown) {
        let match=splitMarkdown[line].match(/^#+ /);
        if(match) {
            let headerType=match[0].length-1;
            renderedMarkdown.push(
                <TypographyHeader element={"h"+headerType}>{splitMarkdown[line].replace(match[0],'')}</TypographyHeader>
            );
            continue;
        }

        match=splitMarkdown[line].match(/^%(.*?)%/);
        if(match) {
            console.log(match);
            renderedMarkdown.push(
                <RenderPlugin plugin={match[1]}></RenderPlugin>
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