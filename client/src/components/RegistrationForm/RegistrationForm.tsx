import { Box, Typography, FormControl, TextField, Button } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { Link as MUILink } from "@mui/material";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { signupUser } from "../redux/thunk/userAction";
import { setAccessToken } from "../../services/api-instance";

const RegistrationForm = forwardRef(
  (
    {
      setOpen,
      setLoginForm,
    }: {
      setOpen: Dispatch<SetStateAction<boolean>>;
      setLoginForm: Dispatch<SetStateAction<boolean>>;
    },
    ref
  ) => {
    const [formData, setFormData] = useState({
      email: "",
      password: "",
      repeatPassword: "",
    });

    const [isFormHaveValue, setIsFormHaveValue] = useState(true);
    const [errors, setErrors] = useState({ email: false, password: false });
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaError, setCaptchaError] = useState(false);
    const [showCAPTCHA, setShowCAPTCHA] = useState(false);

    const { user } = useAppSelector((state) => state.UserSlice);

    const dispatch = useAppDispatch();

    useEffect(() => {
      if (formData.email && formData.password) {
        setIsFormHaveValue(false);
      } else {
        setIsFormHaveValue(true);
      }
    }, [formData]);

    async function handleSubmit() {
      if (formData.password !== formData.repeatPassword) {
        setErrors({ password: [{ message: "Пароли должны совпадать" }] });
        return;
      }

      setShowCAPTCHA(true);

      if (!captchaToken) {
        setCaptchaError(true);
        return;
      }

      setErrors({ email: false, password: false });

      const { payload } = await dispatch(
        signupUser({ ...formData, captchaToken })
      );

      if (payload.id) {
        setOpen(false);
        setAccessToken(payload.accessToken);
      } else {
        const emailErrors = payload.errors.filter(
          (err: { message: string | string[] }) =>
            err.message.includes("Email") || err.message.includes("email")
        );

        const passwordErrors = payload.errors.filter(
          (err: { message: string | string[] }) =>
            err.message.includes("пароль") || err.message.includes("Пароль")
        );

        setErrors({ email: emailErrors, password: passwordErrors });
      }
    }

    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      border: "2px solid #000",
      boxShadow: 24,
      p: 4,
    };
    return (
      <Box sx={style} ref={ref} tabIndex={-1}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 1 }}
        >
          Регистрация в Fabric
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Впервые здесь?{" "}
          <Typography
            component="span"
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => setLoginForm(true)}
          >
            Войти
          </Typography>
        </Typography>

        <FormControl fullWidth sx={{ gap: 2 }}>
          <TextField
            id="email"
            label="Введите почту"
            variant="outlined"
            helperText={errors.email ? errors?.email[0]?.message : null}
            fullWidth
            onChange={(e) =>
              setFormData((pre) => ({ ...pre, email: e.target.value }))
            }
            value={formData.email}
            error={!!errors.email}
          />

          <TextField
            id="password"
            label="Придумайте пароль"
            variant="outlined"
            type="password"
            helperText={errors.password ? errors?.password[0]?.message : null}
            fullWidth
            onChange={(e) =>
              setFormData((pre) => ({ ...pre, password: e.target.value }))
            }
            value={formData.password}
            error={!!errors.password}
          />

          <TextField
            id="confirmPassword"
            label="Подтвердите пароль"
            variant="outlined"
            type="password"
            helperText={errors.email ? errors?.password[0]?.message : null}
            onChange={(e) =>
              setFormData((pre) => ({ ...pre, repeatPassword: e.target.value }))
            }
            value={formData.repeatPassword}
            error={!!errors.password}
            fullWidth
          />

          <Typography variant="body2">
            Нажимая «Зарегистрироваться», вы соглашаетесь с{" "}
            <MUILink
              component={Link}
              to="/public-offer"
              target="_blank"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "gray",
              }}
            >
              публичной офертой
            </MUILink>
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              color: "black",
              borderColor: "black",
              marginRight: 2,
              marginBottom: 3,
              "&:hover": {
                borderColor: "black",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            disabled={isFormHaveValue}
            onClick={handleSubmit}
          >
            Зарегистрироваться
          </Button>
        </FormControl>
        {showCAPTCHA && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <ReCAPTCHA
              sitekey="6LcWAMcqAAAAAGjVseOQrd87NDfSi6nR3sTnJez1"
              onChange={(token: SetStateAction<string | null>) => {
                setCaptchaToken(token);
                setCaptchaError(false);
              }}
            />
          </Box>
        )}
      </Box>
    );
  }
);

export default RegistrationForm;
