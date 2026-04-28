"use client";
import React, { JSX } from "react";
import { Box, Typography } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const { login } = useAuth();
  const router = useRouter();

  const handleSuccess = async (credentialResponse: { credential?: string }) => {
    if (!credentialResponse.credential) return;
    try {
      await login(credentialResponse.credential);
      router.push("/");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Box display="flex" justifyContent="center" mt={3} mb={2}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error("Google login error")}
        />
      </Box>

      {subtitle}
    </>
  );
};

export default AuthLogin;
