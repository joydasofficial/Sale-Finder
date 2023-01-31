import React from 'react'
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from '@mui/material/styles';

//GQL
import { FORGOT_PASSWORD } from '../../graphql/gqlMutations';
import { authClient } from '../../services/authClient'

const forgotPassword = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fData = new FormData(e.currentTarget);

    const email = fData.get('email');

    const {data} = await authClient.mutate({
      mutation: FORGOT_PASSWORD,
      variables: {
        email,
      }
    })

    console.log(data);
  }

  const theme = createTheme();

  return (
    <>
        <ThemeProvider theme={theme}>
        <Grid
          container
          component="main"
          sx={{ height: "100vh" }}
          alignContent="center"
          justifyContent="center"
        >
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(https://source.unsplash.com/random)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid item xs={12} sm={8} md={5} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Forget Password
              </Typography>

              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <Button variant="contained" type="submit" sx={{ mt: 2, mb: 2 }}>
                  Submit
                </Button>
              </Box>
              <Grid item xs={12} align="center" sx={{ pt: "10px" }}>
                <Link href="#" variant="body2">
                  {"Go back"}
                </Link>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  )
}

export default forgotPassword