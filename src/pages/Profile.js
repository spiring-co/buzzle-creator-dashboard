import React from "react";
import useApi from "services/api";
export default () => {
  //TODO get creator ID
  const { data, loading, error } = useApi("/creator/sjjsjjjkaaaa");

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}> {error.message}</p>;
  }
  return (
    <div>
      <p>
        <b>Name </b>
        {data?.name}

        <br />
        <b>Email </b>
        {data?.email}
        <br />
        <b>Phone Number </b>
        {data?.phoneNumber}
      </p>
    </div>
  );
};
