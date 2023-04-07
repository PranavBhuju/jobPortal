import { Grid, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Title = (props) => (
  <Typography {...props} sx={{ fontWeight: "bold", margin: "20px 0", ...props.sx }} variant="h4" />
);

const LinkButton = (props) => (
  <Link
    {...props}
    variant="body1"
    underline="hover"
    sx={{
      color: "#006699",
      fontWeight: "bold",
      "&:hover": {
        opacity: 0.8,
      },
      ...props.sx,
    }} />
);


const Welcome = (props) => {
  let navigate = useNavigate();

  const handleClick = (location) => {
    console.log(location);
    navigate(location);
  };

  return (
    <Grid
      container
      item
      direction="row"
      alignItems="center"
      justifyContent="space-around"
      justify="center"
      sx={{
        backgroundImage: "url(background_header.png)",
        backgroundSize: "contain",
        width: "100wh",
        height: "90vh",
      }}
    >
      <Grid item maxWidth="50%">
        <Title>Bắt đầu công việc phù hợp với bạn</Title>
        <LinkButton onClick={() => handleClick('/signup')}>Tìm việc ngay <span>&#8594;</span></LinkButton>
      </Grid>
      <Grid item maxWidth="50%">
        <Title>Đăng tin tuyển dụng, tìm ứng viên</Title>
        <LinkButton onClick={() => handleClick('/signup')}>Xem CV của các ứng viên <span>&#8594;</span></LinkButton>
      </Grid>
    </Grid>
  );
};

export const ErrorPage = (props) => {
  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      justify="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item>
        <Typography variant="h2">Error 404</Typography>
      </Grid>
    </Grid>
  );
};

export default Welcome;