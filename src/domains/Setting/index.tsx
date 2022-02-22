import React, { useEffect, useState } from "react";
import VerticalTabs from "common/VerticalTabs";
import Profile from "./Profile";
import Account from "./Account";
import Webhooks from "./Webhooks";
import { useHistory, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default () => {
  const query = useQuery()
  const tab = query.get("tab") || "profile"
  const history = useHistory()
  const [initialTab, setInitialTab] = useState(tab)
  const tabs = [
    {
      label: "Profile",
      key: "profile",
      component: <Profile />,
      allowedRoles: ["admin", "user"],
    },
    {
      label: "Credentials",
      component: <Account />,
      key: "credentials",
      allowedRoles: ["admin", "user"],
    },
    {
      label: "Webhooks",
      component: <Webhooks />,
      key: "webhooks",
      allowedRoles: ["admin", "user"],
    },
  ]
  useEffect(() => {
    setInitialTab(tab)
  }, [tab])
  return (
    <VerticalTabs
      onTabIndexChange={(index) => history.push(`/home/settings?tab=${tabs[index].key}`)}
      initialTabIndex={tabs.findIndex(({ key }) => key === initialTab)}
      tabs={tabs}
    />
  );
};
