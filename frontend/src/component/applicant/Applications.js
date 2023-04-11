import { useState, useEffect, useContext } from "react";
import {
  Button,
  Grid,
  Paper,
  Typography,
  Modal,
  Rating,
  Link,
  Avatar
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

import { SetPopupContext } from "../../App";

import apiList, { server } from "../../lib/apiList";
import { AccessTimeOutlined, AttachMoneyOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textTransform: "uppercase",
  },
  jobTileOuter: {
    padding: "30px",
    boxSizing: "border-box",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  const statusLabel = {
    applied: "Đã ứng tuyển",
    shortlisted: "Đang tuyển chọn",
    accepted: "Đã được chấp nhận",
    rejected: "Đã bị từ chối",
    deleted: "Đã bị xóa",
    cancelled: "Đã bị hủy",
    finished: "Đã hoàn thành",
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <Grid item>
      <Paper
        className={classes.jobTileOuter}
        elevation={0}
        sx={{ borderRadius: "20px" }}
      >
        <Grid container item spacing={1} direction="column" alignItems="center">
          <Grid container direction="row" flexWrap="noWrap" gap={1}>
            <Grid item>
              <Avatar
                variant="square"
                sx={{ width: "5rem", height: "5rem" }}
                src="https://1000logos.net/wp-content/uploads/2019/06/Tiktok_Logo.png" />
            </Grid>

            <Grid container direction="column">
              {/* <Grid item>
                <Typography>{application.job.recruiter.name}</Typography>
              </Grid> */}
              <Grid item>
                <Typography variant="h5">{application.job.title}</Typography>
              </Grid>
              <Grid item>
                <Rating value={application.job.rating !== -1 ? application.job.rating : null} readOnly />
              </Grid>
            </Grid>
          </Grid>

          <Grid container item direction="row" justifyContent="flex-start" gap={2}>
            <Grid item container direction="row" alignItems="center" width="auto" gap={1}>
              <AccessTimeOutlined />
              <Typography variant="body2">{application.job.jobType}</Typography>
            </Grid>

            <Grid item container direction="row" alignItems="center" width="auto" gap={1}>
              <AttachMoneyOutlined />
              <Typography variant="body2">{currencyFormatter.format(application.job.salary)} / tháng</Typography>
            </Grid>
          </Grid>

          <Grid item container direction="column" gap={1} marginTop="5px">
            <Typography>Thời gian ứng tuyển: {appliedOn.toLocaleDateString('vi-VN')}</Typography>
            {application.status === "accepted" ||
              application.status === "finished" ? (
              <Typography>Thời gian bắt đầu công việc: {joinedOn.toLocaleDateString('vi-VN')}</Typography>
            ) : null}

            <Typography>
              Trạng thái: {application.status ?
                <span style={{ color: colorSet[application.status], fontWeight: 500 }}>
                  {statusLabel[application.status]}
                </span> : null}
            </Typography>
          </Grid>

          <Grid container item direction="row" alignItems="center" justifyContent="flex-end" paddingRight="20px" gap={4}>
            {application.status === "accepted" ||
              application.status === "finished" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  fetchRating();
                  setOpen(true);
                }}
              >
                Đánh giá
              </Button>) : null}
            <Link onClick={() => navigate(`/job/${application.job._id}`)}>Chi tiết</Link>
          </Grid>
        </Grid>
        <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
          <Paper
            style={{
              padding: "20px",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: "30%",
              alignItems: "center",
            }}
          >
            <Rating
              name="simple-controlled"
              size="large"
              style={{ marginBottom: "30px" }}
              value={rating === -1 ? null : rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => changeRating()}
            >
              Xác nhận
            </Button>
          </Paper>
        </Modal>
      </Paper >
    </Grid >
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h3" padding={5}>Việc làm đã ứng tuyển</Typography>
      </Grid>
      <Grid
        container
        direction="column"
        gap={2}
        marginTop={4}
      >
        {applications.length > 0 ? (
          applications.map((obj) => (
            <ApplicationTile application={obj} />
          ))
        ) : (
          <Typography variant="h5" style={{ textAlign: "center" }}>
            Bạn chưa ứng tuyển vào công việc nào
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
