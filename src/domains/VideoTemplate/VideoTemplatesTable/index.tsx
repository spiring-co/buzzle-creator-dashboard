
import React, { useEffect, useState } from "react";
import VerticalTabs from "common/VerticalTabs";
import MyTemplates from "./MyTemplates";
import PublicTemplates from "./PublicTemplates";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { Button, Paper } from "@material-ui/core";
import { useAuth } from "services/auth"

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default () => {
  const query = useQuery()
  const tab = query.get("tab") || "templates"
  const history = useHistory()
  let { url, path } = useRouteMatch();
  const { user } = useAuth()
  const [initialTab, setInitialTab] = useState(tab)
  const tabs = [
    {
      label: user?.role == "admin" ? "Templates" : "Your Templates",
      key: "templates",
      component: <MyTemplates />,
      allowedRoles: ["admin", "user"],
    },
    {
      label: "Public Templates",
      component: <PublicTemplates />,
      key: "public",
      allowedRoles: ["user"],
    },
  ]
  // useEffect(() => {
  //   setInitialTab(tab)
  // }, [tab])
  return (
    <>
      {user?.role === "user" ? <Paper style={{ marginBottom: 25, padding: 15 }}>
        <Button
          color="primary"
          variant="outlined"
          style={{ margin: 10 }}
          onClick={() => history.push(`${url}/ae/add`)}>
          Add After Effects Template
        </Button>
        <Button
          color="primary"
          variant="outlined"
          style={{ margin: 10 }}
          onClick={() => history.push(`${url}/remotion/add`)}>
          Add Remotion Template
        </Button>
        <Button
          variant="outlined"
          style={{ margin: 10 }}
          onClick={() => {
            history.push(`${url}/drafts`);
          }}>
          Drafted Templates
        </Button>
      </Paper> : <div />}
      <VerticalTabs
        //  onTabIndexChange={(index) => history.push(`/home/videoTemplates?tab=${tabs[index].key}`)}
        //  initialTabIndex={tabs.findIndex(({ key }) => key === initialTab)}
        tabs={tabs}
      /></>

  );
};

