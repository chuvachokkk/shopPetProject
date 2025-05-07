import React from "react";
import { useAppDispatch, useAppSelector } from "../../components/redux/hook";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import * as Yup from "Yup";
import { Box, Button, Container, Typography } from "@mui/material";
import { updateUser } from "../../components/redux/thunk/userAction";

const signUpSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .min(2, "Минимум 2 символа")
    .max(16, "Максимум 16 символов"),
});

function Data() {
  const { user } = useAppSelector((state) => state.UserSlice);
  const dispatch = useAppDispatch();

  return (
    <Container component="section">
      <Typography sx={{ marginBottom: 3 }}>Мои данные</Typography>

      <Formik
        initialValues={{
          name: "",
          lastname: "",
          surname: "",
          phone: "",
          address: "",
        }}
        validationSchema={signUpSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);

          setSubmitting(false);
          dispatch(updateUser(values));
        }}
      >
        {({ submitForm, isSubmitting }) => (
          <Form>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Field
                component={TextField}
                name="name"
                type="text"
                label="Имя"
                variant="standard"
              />

              <Field
                component={TextField}
                type="text"
                label="Фамилия"
                name="lastname"
                variant="standard"
              />

              <Field
                component={TextField}
                type="text"
                label="Отчество"
                name="surname"
                variant="standard"
              />

              <br />
            </Box>

            <Box
              sx={{ marginTop: 3, marginBottom: 3, display: "flex", gap: 3 }}
            >
              <Field
                component={TextField}
                type="text"
                label="Адрес"
                name="address"
                variant="standard"
                sx={{ flex: 1 }}
              />
              <Field
                component={TextField}
                type="text"
                label="Телефон"
                name="phone"
                variant="standard"
              />
            </Box>

            <Typography
              variant="overline"
              sx={{ marginBottom: 3, display: "block" }}
            >
              Почта: {user?.email}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              onClick={submitForm}
            >
              Сохранить
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default Data;
