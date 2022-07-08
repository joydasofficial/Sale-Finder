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
import { authClient } from '../../services/authClient'
import { LOGIN_MUTATION } from '../../graphql/gqlMutations'

const Login = () => {

const theme = createTheme();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const fData = new FormData(e.currentTarget);
    const email = fData.get('email');
    const password = fData.get('password');

    const { data } = await authClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        email,
        password,
      }
    })

    console.log(data);
	}

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
                Login
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button variant="contained" type="submit" sx={{ mt: 2, mb: 2 }}>
                  Login
                </Button>
              </Box>
              <Grid item xs={12} align="center" sx={{ pt: "10px" }}>
                <Link href="#" variant="body2">
                  {"Dont have an account? Register now!"}
                </Link>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  )
}

export default Login