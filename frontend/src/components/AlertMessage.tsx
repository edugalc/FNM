"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  type?: "success" | "error" | "info";
  message: string;
  onClose: () => void;
};

export default function AlertMessage({ type = "info", message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-black text-white border border-black",
    error: "bg-red-600 text-white",
    info: "bg-white text-black border border-black",
  }[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-lg transition z-[9999] ${styles}`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}
