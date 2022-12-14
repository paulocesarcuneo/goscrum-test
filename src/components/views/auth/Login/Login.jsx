import React from "react";
import { useFormik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { swal } from "../../../../utils/swal";
import "../Auth.styles.css";

const { REACT_APP_API_ENDPOINT: API_ENDPOINT } = process.env;

export const Login = () => {
  console.log(API_ENDPOINT);
  const navigate = useNavigate();

  const initialValues = {
    userName: "",
    password: "",
  };

  const required = "* Campo obligatorio";

  const validationSchema = () =>
    Yup.object().shape({
      userName: Yup.string()
        .min(4, "La cantidad mínima de caracteres es 4")
        .required(required),
      password: Yup.string().required(required),
    });

  const onSubmit = async () => {
    const { userName, password } = values;

    const { data } = await axios.post(`${API_ENDPOINT}auth/login`, {
      userName,
      password,
    });
    if (data.status_code === 200) {
      localStorage.setItem("token", data.result.token);
      localStorage.setItem("userName", data.result.user.userName);
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + data.result.token;
      
      navigate("/", { replace: true });
    } else {
      swal();
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const { handleSubmit, handleChange, errors, touched, handleBlur, values } =
    formik;

  return (
    <>
      <div className="curve"></div>
      <div className="auth">
        <form onSubmit={handleSubmit}>
          <h1>Iniciar sesión</h1>
          <div>
            <label>Nombre de usuario</label>
            <input
              type="text"
              name="userName"
              onChange={handleChange}
              value={values.userName}
              onBlur={handleBlur}
              className={errors.userName && touched.userName ? "error" : ""}
            />
            {errors.userName && touched.userName && (
              <div>{errors.userName}</div>
            )}
          </div>
          <div>
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={values.password}
              onBlur={handleBlur}
              className={errors.password && touched.password ? "error" : ""}
            />
            {errors.password && touched.password && (
              <div>{errors.password}</div>
            )}
          </div>
          <div>
            <button type="submit">Enviar</button>
          </div>
          <div>
            <Link to="/register">Registrarme</Link>
          </div>
        </form>
      </div>
    </>
  );
};
