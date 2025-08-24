"use client";

import { Toaster } from "sonner";

export const SonnerProvider = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      expand={true}
      theme="light"
    />
  );
};
