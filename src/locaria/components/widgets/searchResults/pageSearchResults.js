import React from "react"
import {Pagination} from "@mui/material";
import {useStyles} from "stylesLocaria";
import {useDispatch, useSelector} from "react-redux";
import {setPage} from "../../redux/slices/searchDrawerSlice";
import Container from "@mui/material/Container";

export default function PageSearchResults(props) {
    const classes = useStyles();
    const dispatch = useDispatch()

    const totalPages = useSelector((state) => state.searchDraw.totalPages);
    const page = useSelector((state) => state.searchDraw.pages);

    if(totalPages>0) {
        return (
            <Container>
                <Pagination count={totalPages} page={page} variant="outlined" shape="rounded" color="primary"
                            className={classes.SearchDrawPage}
                            onChange={(e, page) => {
                                dispatch(setPage(page))
                            }}
                />
            </Container>
        )
    } else {
        return (
            <></>
        )
    }
}