import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useCallback, useRef, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";

import usePaginatedFetch from "../services/usePaginatedFetch";

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default ({ url, listHeader, listKeys }) => {
  const classes = useStyles();
  const history = useHistory();
  let { path } = useRouteMatch();
  const [page, setPage] = useState(1);

  let { data, hasMore, loading, error } = usePaginatedFetch(url, page, 10);
  const observer = useRef();

  const lastElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page]
  );

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {listHeader.map((item) => (
              <StyledTableCell>{item}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <StyledTableRow
              ref={data.length === index + 1 ? lastElement : null}
              key={index}>
              {listKeys.map((i, index) => (
                <StyledTableCell component="th" scope="row">
                  {index === 0 && (
                    <Link
                      to={{
                        pathname: `${path}${item._id}`,
                        state: { video: item },
                      }}
                    >
                      {item[i]}
                    </Link>
                  )}

                  {index === 1 && (
                    <Button
                      color="primary"
                      variant="contained"
                      style={{ marginLeft: 10 }}
                      onClick={() =>
                        history.push({
                          pathname: `/createOrder/${item.videoTemplateId}`,
                        })
                      }
                      children={"Render Form"}
                    />
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
          <tr>{loading && "Loading..."}</tr>
        </TableBody>
        {error && <p>{error.message}</p>}
      </Table>
    </TableContainer>
  );
};