import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import VideoTemplateForm from "./VideoTemplateForm";
import VideoTemplatesTable from "./VideoTemplatesTable";
import VideoTemplateDrafts from "./VideoTemplateDrafts";
import VideoTemplateDetails from "./VideoTemplateDetails";
import VideoTemplatePublish from "./VideoTemplatePublish";
import Page from "common/Page";

export default () => {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/`} exact
        render={props => (
          <Page props={props} component={VideoTemplatesTable} title="Video Templates" />
        )} />
      <Route path={`${path}/:type/add`}
        render={props => (
          <Page props={props} component={VideoTemplateForm} title="Create Video Template" />
        )} />
      <Route path={`${path}/drafts`}
        render={props => (
          <Page props={props} component={VideoTemplateDrafts} title="Drafted Templates" />
        )} />
      <Route path={`${path}/:uid/edit`}
        render={props => {
          return (
            <Page props={props} component={VideoTemplateForm} title="Edit Video Template" />
          )
        }} />

      <Route path={`${path}/:id/publish`}
        render={props => (
          <Page props={props} component={VideoTemplatePublish} title="Publish Template" />
        )} />
      <Route path={`${path}/:id`}
        render={props => (
          <Page props={props} component={VideoTemplateDetails} title="Video Details" />
        )} />
    </Switch>
  );
};
