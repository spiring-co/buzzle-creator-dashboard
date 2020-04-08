import React, { useState, useRef, useCallback } from "react";
import usePaginatedFetch from "../services/usePaginatedFetch";
import { Link } from "react-router-dom";
export default ({
  page,
  url,
  from,
  size,
  setPageNumber,
  listHeader,
  listKeys,
}) => {
  let { data, hasMore, loading, error } = usePaginatedFetch(url, page, size);
  console.log(hasMore);
  const observer = useRef();
  const lastElement = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        console.log(hasMore);
        if (entries[0].isIntersecting && hasMore) {
          console.log("increase page number", page);
          setPageNumber(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  if (from === "templates") {
    return (
      <table>
        <thead>
          <tr>
            {listHeader.map((item) => (
              <th>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            if (data.length === index + 1) {
              return (
                <tr ref={lastElement} key={index}>
                  {listKeys.map((i, index) => {
                    if (index === 0) {
                      return (
                        <Link
                          to={{
                            pathname: `${document.location.pathname}/${item[i]}`,
                            state: { video: item },
                          }}
                        >
                          <td>{item[i]}</td>
                        </Link>
                      );
                    }
                    return <td>{item[i]}</td>;
                  })}
                </tr>
              );
            } else {
              return (
                <tr key={index}>
                  {listKeys.map((i, index) => {
                    if (index == 0) {
                      return (
                        <Link
                          to={{
                            pathname: `${document.location.pathname}/${item[i]}`,
                            state: { video: item },
                          }}
                        >
                          <td>{item[i]}</td>
                        </Link>
                      );
                    }
                    return <td>{item[i]}</td>;
                  })}
                </tr>
              );
            }
          })}

          <tr>{loading && "Loading Templates..."}</tr>
          <tr>{error && alert(error.message)}</tr>
        </tbody>
      </table>
    );
  } else {
    return (
      <table>
        <thead>
          <tr>
            {listHeader.map((item) => (
              <th>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            if (data.length === index + 1) {
              return (
                <tr ref={lastElement} key={index}>
                  {listKeys.map((i, index) => {
                    return <td>{item[i]}</td>;
                  })}
                </tr>
              );
            } else {
              return (
                <tr key={index}>
                  {listKeys.map((i, index) => (
                    <td>{item[i]}</td>
                  ))}
                </tr>
              );
            }
          })}

          <tr>{loading && "Loading Templates..."}</tr>
          <tr>{error && alert(error.message)}</tr>
        </tbody>
      </table>
    );
  }
};
