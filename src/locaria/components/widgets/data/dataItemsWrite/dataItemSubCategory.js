import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {TreeItem, TreeView} from "@mui/lab";

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {useDispatch} from "react-redux";
import {setFieldValue, setupField} from "../../../redux/slices/formSlice";
import DataItemsTypography from "./dataItemsTypography";

const DataItemSubCategory = ({id,name,data,prompt,required,category}) => {

    const dispatch = useDispatch()

    const [selected, setSelected] = React.useState([]);

    let mapper={};

    let categorySubs=window.systemCategories.getChannelSubs(category);

    const handleSelect = (event, nodeIds) => {
       /* console.log(nodeIds);*/
        console.log(mapper[nodeIds]);
        setSelected(nodeIds);
        dispatch(setFieldValue({index:id,value:mapper[nodeIds]}))
    };


    useEffect(() => {
        dispatch(setupField({index: id, value: data,required:required}))
    },[]);


    function DataMapTreeLevel({ptr,idPath,path,color='white'}) {
        let treeLevel=[];
        for(let p in ptr) {
            let newPath=`${idPath? idPath+'.':''}${ptr[p].name.replace(/[^a-zA-Z]/g,'')}`;
            let newArrayPath=[...path];
            newArrayPath.push(ptr[p].name);
            mapper[newPath]=newArrayPath;
            if(ptr[p].color)
                color=ptr[p].color;
            treeLevel.push(
                <TreeItem label={ptr[p].name} nodeId={newPath} sx={{
                    background: color
                }}>
                    {ptr[p].subs &&
                        <DataMapTreeLevel ptr={ptr[p].subs} color={color} idPath={newPath} path={newArrayPath}/>
                    }
                </TreeItem>
            );
        }
        return treeLevel;
    }

    return (
        <Grid container spacing = {2}>
            <Grid item md={4}>
                <DataItemsTypography name={name} prompt={prompt} required={required}/>
            </Grid>
            <Grid item md={8}>
                <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                    selected={selected}
                    onNodeSelect={handleSelect}
                >
                    <DataMapTreeLevel ptr={categorySubs} idPath={""} path={[]}/>
                </TreeView>
            </Grid>

    </Grid>

    )
}



export default DataItemSubCategory;