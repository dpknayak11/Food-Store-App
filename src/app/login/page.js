"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { httpPost } from "@/services/api";
import { toast } from "react-toastify";

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [router]);

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = isLogin ? "/auth/login" : "/auth/register";

    const payload = isLogin
      ? { email: form.email, password: form.password }
      : form;

    const res = await httpPost(url, payload);

    // console.log("API RES 👉", res);

    if (!res.error) {
      toast.success(res.message || "Success");

      const token = res.data.token;
      const user = res.data.data;

      dispatch(setUser({ user, token }));
      localStorage.setItem("token", token);

      router.push("/");
    } else {
      toast.error(res.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h3>{isLogin ? "Welcome Back! 👋" : "Create Account 🚀"}</h3>

        {!isLogin && (
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Full Name"
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Email Address"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Password"
          onChange={handleChange}
        />

        <button className="btn btn-primary w-100 mt-2" onClick={handleSubmit}>
          {isLogin ? "Login" : "Create Account"}
        </button>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
        <div className="text-center">
          <span
            className="text-muted small fw-semibold"
            style={{ cursor: "pointer", transition: "color 0.2s ease" }}
            onClick={() => router.push("/")}
            onMouseEnter={(e) => (e.target.style.color = "#dc3545")}
            onMouseLeave={(e) => (e.target.style.color = "")}
          >
            Home
          </span>
        </div>
      </div>
    </div>
  );
}
