import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

type SignInForm = {
  email: string;
  password: string;
};

export function useSignin() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { login, isLoading } = useAuth();

  const onSubmit = async (data: SignInForm) => {
    await login(data);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return {
    isLoading,
    showPassword,
    toggleShowPassword,
    onSubmit,
  };
}
