import React, { useCallback, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import { useHistory } from "react-router-dom";
import usePaginatedFetch from "../services/usePaginatedFetch";
import Button from "react-bootstrap/Button";
export default ({ url, listHeader, listKeys }) => {
  const history = useHistory();
  const [page, setPage] = useState(1);

  let { data, hasMore, loading, error } = usePaginatedFetch(url, page, 10);
  console.log(data);
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
            {listKeys.map((i, index) => (
              <td>
                {item[i]}
                {index === 1 && (
                  <Button
                    className="float-right"
                    variant="outline-primary"
                    onClick={() =>
                      history.push({
                        pathname: `/createOrder/${item.videoTemplateId}`,
                      })
                    }
                    children={"Render Form"}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
        <tr>{loading && "Loading..."}</tr>
      </tbody>
      {error && <p>{error.message}</p>}
    </Table>
  );
};
