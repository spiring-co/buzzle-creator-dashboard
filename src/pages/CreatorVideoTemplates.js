import LazyLoadingList from "components/LazyLoadingList";
import React, { useState } from "react";
import { Button, Container, Typography } from "@material-ui/core";
import { Link, useRouteMatch, Redirect, useHistory } from "react-router-dom";
import MaterialTable from "material-table";
import { jobSchemaConstructor } from "services/helper";


export default () => {
  let { url, path } = useRouteMatch();
  const history = useHistory()
  const [page, setPageNumber] = useState(1);
  const uri = `${process.env.REACT_APP_API_URL}/creators/${localStorage.getItem('creatorId')}/videoTemplates`;

  const renderTestJob = async (data) => {
    try {
      var jobs = jobSchemaConstructor(data)
      console.log(jobs)
      await Promise.all(jobs.map(job => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify(job);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        fetch("http://localhost:5000/jobs", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result)

          })
          .catch(error => console.log('error', error));
      }))
      history.push('/home/jobs')

    } catch (err) {
      console.log(err)
    }

  }
  return (
    <Container>
      <Typography variant="h4">Your video templates</Typography>
      <Button
        style={{ marginTop: 20, marginBottom: 20 }}
        color="primary"
        variant="contained"
        children={<Link to={`${url}/add`}
          style={{
            textDecoration: 'none',
            color: 'white',

          }}>
          + Add Template
        </Link>}
      />
      <MaterialTable
        title="Your Video Templates"
        columns={[
          {
            title: 'Id',
            field: 'id',
            render: rowData => (<Link to={{
              pathname: `${path}${rowData.id}`,
              state: { video: rowData },
            }}><Typography>{rowData.id}</Typography></Link>)

          },
          {
            title: 'Title',
            field: 'title',

          },
          {
            title: 'Render Test Job',
            field: 'id',
            render: (rowData) => (<Button
              color="primary"
              variant="contained"
              margin="dense"
              onClick={() => renderTestJob(rowData)}
              children={"Render Test Job"}
            />)
          }
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            console.log(query.page)
            fetch(`${uri}?page=${query.page + 1}&size=${query.pageSize}`)
              .then(response => response.json())
              .then(result => {
                console.log(result)
                resolve({
                  data: result.data.filter((item) => !item.isDeleted),
                  page: query.page,
                  totalCount: result.count,
                })
              })
          })
        }
      />
      {/* <LazyLoadingList
        from="templates"
        page={page}
        url={uri}
        size={10}
        setPageNumber={setPageNumber}
        listHeader={["Title", "Description"]}
        listKeys={["title", "description"]}
      /> */}
    </Container>
  );
};
