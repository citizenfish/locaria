import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import {setCategory,setCategories,clearCategory} from "../../redux/slices/categorySelectSlice";
import MenuItem from "@mui/material/MenuItem";
import {InputLabel, Select} from "@mui/material";
import {setPage} from "../../redux/slices/adminPagesSlice";
import FormControl from "@mui/material/FormControl";

export default function CategorySelector() {

    const categories = useSelector((state) => state.categorySelect.categories);
    const category = useSelector((state) => state.categorySelect.currentSelected);
    const dispatch = useDispatch()

    useEffect(() => {
        window.websocket.registerQueue('getCategories', (json) => {
            if (json.packet.categories){
                dispatch(setCategories(json.packet.categories))
            }

        })

        window.websocket.send({
            "queue": "getCategories",
            "api": "api",
            "data": {
                "method": "list_categories",
                "attributes": "true"
            }
        })
    },[])

    let categoryList = [];
    for(let c in categories) {
        categoryList.push( <MenuItem key={categories[c].key} value={categories[c].key}>{categories[c].key}</MenuItem>)
    }
    categoryList.push( <MenuItem key=" -- All Categories --" value="*"> -- All Categories --</MenuItem>)


    return (

            <>
                {categoryList.length > 1 &&
                    //TODO pass in as props
                    <FormControl style={{minWidth: 400, marginTop: 20, marginBottom: 20}}>
                        <InputLabel id="locaria-category-select-label">Category</InputLabel>
                        <Select
                            labelId="locaria-category-select-label"
                            id="locaria-category-select"
                            value={category || "*"}
                            label="Category"
                            onChange={(e) => {
                                dispatch(setCategory(e.target.value));
                            }}
                        >
                            {categoryList}
                        </Select>
                    </FormControl>
                }
            </>



    )
}