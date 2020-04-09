import AddVideoTemplate from "pages/AddVideoTemplate";
import VideoTemplate from "pages/VideoTemplate";
import React, { useState } from "react";
import {
  Link,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import useApi from "services/api";
import LazyLoadingList from "components/LazyLoadingList";
export default () => {
  let { path } = useRouteMatch();

  return (
    <div>
      <br />
      <Switch>
        <Route path={`${path}/`} exact component={CreatorVideoTemplates} />
        <Route path={`${path}/add`} component={AddVideoTemplate} />
        <Route path={`${path}/:uid/edit`} component={AddVideoTemplate} />
        <Route path={`${path}/:uid`} component={VideoTemplate} />
      </Switch>
    </div>
  );
};

const CreatorVideoTemplates = () => {
  let { url } = useRouteMatch();
  const [page, setPageNumber] = useState(1);
  const uri = `${process.env.REACT_APP_API_URL}/creator/sjjsjjjkaaaa/videoTemplates`;
  let history = useHistory();
  return (
    <div>
      <Link
        to={{
          pathname: `${url}/add`,
          state: {
            edit: false,
            video: null,
          },
        }}
      >
        <button>+ Add Template</button>
      </Link>
      <br />
      <LazyLoadingList
        from="templates"
        page={page}
        url={uri}
        size={10}
        setPageNumber={setPageNumber}
        listHeader={["UID", "Title", "Description"]}
        listKeys={["_id", "title", "description"]}
      />
    </div>
  );
};

{
  /* <table className="table">
        <tr style={{ background: "antiquewhite" }}>
          <th>UID</th>
          <th>Title</th>
          <th>Description</th>
        </tr>
        {data.map((t, index) => {
          if (!t.isDeleted) {
            return (
              <tr>
                <Link
                  to={{
                    pathname: `${url}/${t._id}`,
                    state: { video: t },
                  }}
                >
                  <td>{t._id}</td>
                </Link>
                <td>{t.title}</td>
                <td>
                  {t.description}
                  <span> </span>{" "}
                  <Link to={`/createOrder/${t.videoTemplateId}`}>
                    <button>Send Form</button>
                  </Link>
                </td>
              </tr>
            );
          }
        })}
      </table> */
}
