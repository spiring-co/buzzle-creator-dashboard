import React, { useCallback, useRef, useState } from "react";
import Table from "react-bootstrap/Table";

import usePaginatedFetch from "../services/usePaginatedFetch";

export default ({ url, listHeader, listKeys }) => {
  const [page, setPage] = useState(1);
  let { data, hasMore, loading, error } = usePaginatedFetch(url, page, 10);
  const observer = useRef();

  const lastElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        console.log(hasMore);
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page]
  );

  return (
    <Table responsive bordered striped hover>
      <thead>
        <tr>
          {listHeader.map((item) => (
            <th>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr ref={data.length === index + 1 ? lastElement : null} key={index}>
            {listKeys.map((i) => (
              <td>{item[i]}</td>
            ))}
          </tr>
        ))}
        <tr>{loading && "Loading..."}</tr>
      </tbody>
      {error && <p>{error.message}</p>}
    </Table>
  );
};
