import { useEffect, useState } from "react";
import axios from "axios";

export default function usePaginatedFetch(url, page, size) {
  console.log("size", size);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: `${url}?page=${page}&size=${size}`,
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        // filter data based on isDeleted key, to be checked on get all orders
        setData([...data, ...res.data.data.filter((item) => !item.isDeleted)]);
        setHasMore(res.data.hasMore);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => {
      cancel();
    };
  }, [size, page]);
  console.log("has More", hasMore);
  return { loading, error, data, hasMore };
}
