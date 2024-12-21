"use server";

import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const apiKey = process.env.GOOGLE_API_KEY;
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "./config/sheetsAPI.json", // Path to your JSON key
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Replace with your Sheet ID
        const range = "Sheet1"; // Adjust the range as needed

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        res.status(200).json(response.data.values); // Return the data to the client
    } catch (error) {
        console.error("Error fetching sheet data: (Server Side)", error);
        res.status(500).json({ error: "Failed to fetch sheet data" });
    }
}