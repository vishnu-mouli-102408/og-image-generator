"use client";

import { motion } from "framer-motion";

import { Wand2, Check, CopyIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { deployementUrl } from "@/constants/env";

const FormDataSchema = z.object({
	title: z.string().nonempty("Title is required"),
	description: z.string().nonempty("Description is required"),
	ImgUrl: z.union([z.string().url("Invalid URL"), z.string().length(0)]).optional(),
});

type FormData = z.infer<typeof FormDataSchema>;

export default function Home() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(FormDataSchema),
		defaultValues: {
			title: "",
			description: "",
			ImgUrl: "",
		},
	});

	const onSubmit = (data: FormData) => {
		console.log(data);
		const { title, description, ImgUrl } = data;
		const params = new URLSearchParams();
		if (title) params.append("title", title);
		if (description) params.append("description", description);
		if (ImgUrl) params.append("imgUrl", ImgUrl || `${deployementUrl}/images/logo.png`);
		const ogImageUrl = `/api/og?${params.toString()}`;
		setPreviewUrl(ogImageUrl);
	};

	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const params = new URLSearchParams();
		params.append("title", "Open Graph Img Generator");
		params.append("description", "Create beautiful social media preview Images in seconds");
		params.append("imgUrl", `${deployementUrl}/images/logo.png`);

		const ogImageUrl = `/api/og?${params.toString()}`;
		setPreviewUrl(ogImageUrl);
	}, []);

	const handleCopyUrl = () => {
		const fullUrl = `${deployementUrl}${previewUrl}`;
		navigator.clipboard.writeText(fullUrl)?.then(() => {
			console.log("Copied to clipboard");
			setCopied(true);
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		});
	};

	console.log("ERRORS", errors);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
		},
	};

	return (
		<div className="min-h-screen bg-background text-foreground p-4 md:p-8">
			<ThemeToggle />
			<motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto">
				<motion.div variants={itemVariants} className="text-center mb-12">
					<h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
						Open Graph Img Generator
					</h1>
					<p className="text-muted-foreground text-lg md:text-xl">
						Create beautiful social media preview Images in seconds
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-8 auto-rows-fr">
					<motion.div variants={itemVariants} className="h-full">
						<div className="bg-card text-card-foreground rounded-xl p-6 border shadow-lg h-full flex flex-col">
							<form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6 justify-center  flex flex-col">
								<div className="space-y-2">
									<Label htmlFor="title" className="block text-sm font-medium">
										Title
									</Label>
									<Input
										id="title"
										type="text"
										placeholder="Enter title"
										{...register("title", { required: "Title is required" })}
										className="w-full"
									/>
									{errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="description" className="block text-sm font-medium">
										Description
									</Label>
									<Textarea
										id="description"
										placeholder="Enter description"
										{...register("description", { required: "Description is required" })}
										className="w-full min-h-[6rem]"
									/>
									{errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="ImgUrl" className="block text-sm font-medium">
										Image URL
									</Label>
									<Input
										id="ImgUrl"
										type="url"
										placeholder="Enter image URL"
										{...register("ImgUrl", { required: "Image URL is required" })}
										className="w-full"
									/>
									{errors.ImgUrl && <p className="text-red-500 text-sm">{errors.ImgUrl.message}</p>}
									<p className="text-gray-500 text-sm">Default</p>
								</div>

								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									type="submit"
									className="w-full bg-gradient-to-r cursor-pointer from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-purple-700 transition duration-200"
								>
									<Wand2 className="w-5 h-5" />
									<span>Generate Preview</span>
								</motion.button>
							</form>
						</div>
					</motion.div>

					<motion.div variants={itemVariants} className="h-full">
						<div className="bg-card text-card-foreground rounded-xl p-6 border shadow-lg h-full flex flex-col">
							{previewUrl && (
								<Image
									src={previewUrl}
									alt="Open Graph Image"
									height={630}
									width={1200}
									className="w-full h-full object-cover rounded-lg"
								/>
							)}

							<div className="flex flex-col mt-6 gap-2 ">
								<span>Generated URL</span>
								<div className="bg-muted rounded-md px-3 py-2 flex items-center justify-between">
									<span className="text-sm truncate">
										{previewUrl ? `${deployementUrl}${previewUrl}` : "URL will appear here"}{" "}
									</span>
									<Button
										onClick={handleCopyUrl}
										variant={"ghost"}
										size={"icon"}
										className="text-muted-foreground hover:bg-muted cursor-pointer"
									>
										{!copied ? <CopyIcon className="w-4 h-4" /> : <Check className="w-4 h-4" />}
									</Button>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
