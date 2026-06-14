"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface RegisterCompanyModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const RegisterCompanyModalContext = createContext<RegisterCompanyModalContextValue | null>(null);

export function RegisterCompanyModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openModal, closeModal }),
    [isOpen, openModal, closeModal],
  );

  return (
    <RegisterCompanyModalContext.Provider value={value}>
      {children}
    </RegisterCompanyModalContext.Provider>
  );
}

export function useRegisterCompanyModal(): RegisterCompanyModalContextValue {
  const ctx = useContext(RegisterCompanyModalContext);
  if (!ctx) {
    throw new Error(
      "useRegisterCompanyModal must be used within a RegisterCompanyModalProvider",
    );
  }
  return ctx;
}
