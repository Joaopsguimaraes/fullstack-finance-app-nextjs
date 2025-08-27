import { useAuth } from "@/hooks/use-auth";
import { RegisterData } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useRegister() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const onToggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onToggleShowConfirmPassword = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const onSubmit = async (data: RegisterData) => {
    const result = await register(data);
    console.log(result);
    router.push("/auth/signin");
  };

  return {
    showPassword,
    showConfirmPassword,
    onToggleShowPassword,
    onToggleShowConfirmPassword,
    onSubmit,
    isLoading,
  };
}
