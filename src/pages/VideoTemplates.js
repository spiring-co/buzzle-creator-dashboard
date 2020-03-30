import AddVideoTemplate from "pages/AddVideoTemplate";
import VideoTemplate from "pages/VideoTemplate";
import React from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import useApi from "services/api";
export default () => {
  let { path } = useRouteMatch();

  return (
    <div>
      <br />
      <Switch>
        <Route path={`${path}/`} exact component={CreatorVideoTemplates} />
        <Route path={`${path}/add`} component={AddVideoTemplate} />
        <Route path={`${path}/:uid`} component={VideoTemplate} />
      </Switch>
    </div>
  );
};

const CreatorVideoTemplates = () => {
  let { url } = useRouteMatch();

  const { data, loading, error } = useApi(
    "/creator/sjjsjjjkaaaa/videoTemplates"
  );
  console.log(data);
  if (loading) return <p>Loading your templates...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <Link to={`${url}/add`}>
        <button>+ Add Template</button>
      </Link>
      <br />
      <table className="table">
        <tr style={{ background: "antiquewhite" }}>
          <th>UID</th>
          <th>Title</th>
          <th>Description</th>
        </tr>
        {data.map(t => (
          <tr>
            <Link
              to={{
                pathname: `${url}/${t._id}`,
                state: { videoTemplateId: t.videoTemplateId }
              }}
            >
              <td>{t._id}</td>
            </Link>
            <td>{t.title}</td>
            <td>{t.description}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};
