"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="fixed top-4 right-4 cursor-pointer p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
		>
			<Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-2 right-2" />
			<span className="sr-only">Toggle theme</span>
		</motion.button>
	);
}
