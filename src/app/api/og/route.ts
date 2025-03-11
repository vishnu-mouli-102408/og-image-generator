import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import React from "react";
import { deployementUrl } from "@/constants/env";
export const runtime = "edge";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const title = searchParams.get("title") || "Default Title";
	const description = searchParams.get("description") || "Default Description";
	const imgUrl = searchParams.get("imgUrl") || "";
	const decodedUrl = imgUrl ? decodeURIComponent(imgUrl) : `${deployementUrl}/images/logo.png`;
	try {
		return new ImageResponse(
			React.createElement(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						width: "100%",
						height: "100%",
						padding: "40px",
						color: "white",
						justifyContent: "center",
						alignItems: "center",
						background: "linear-gradient(to top right, #1d4ed8, #3730a3, #4c0d2e)",
					},
				},
				decodedUrl &&
					React.createElement("img", {
						style: { objectFit: "contain" },
						src: decodedUrl,
						alt: "Logo",
						width: 200,
						height: 200,
						title: "Logo",
					}),
				React.createElement(
					"h1",
					{
						style: {
							marginTop: "16px",
							// width: "100%",
							// textAlign: "center",
							fontSize: "52px",
							fontWeight: "bold",
							color: "white",
						},
					},
					title
				),
				React.createElement(
					"p",
					{
						style: {
							marginTop: "1px",
							// width: "100%",
							// textAlign: "center",
							fontSize: "28px",
							fontWeight: "normal",
							color: "white",
						},
					},
					description
				)
			)
		);
	} catch (error) {
		console.log("Error Generating Image", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown Error";
		return new ImageResponse(
			React.createElement(
				"div",
				{
					style: {
						display: "flex",
						flexDirection: "column",
						width: "100%",
						height: "100%",
						padding: 20,
						backgroundColor: "#1a1a1a",
						color: "white",
						justifyContent: "center",
						alignItems: "center",
						fontSize: 50,
						fontWeight: "bold",
					},
				},
				React.createElement("h1", null, "Error"),
				React.createElement("p", null, errorMessage)
			)
		);
	}
}
