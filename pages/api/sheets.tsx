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

        const rows = response.data.values || [];

        const headers = rows[0];
        const dataRows = rows.slice(1);

        const filteredData: string[][] = []; // Initializes empty array of rows

        for (const row of dataRows) {
            if (row[2] && row[2]?.toLowerCase() == "true") {
                // console.log(row[1]);
                filteredData.push(row);
            }
        }
        // For loop to go through each row and append data that has a checkmark of "true"

        // NOTE: For loop to use to grab email and check if has a "true" value (ie. email is sent to user)
        // If not true, send email to user w/ QR code

        // Note Note: Need to figure out what if email couldn't be sent, send to a seperate text file and have whoever in charge of emails send it individually?





        res.status(200).json([headers, ...filteredData]); // Return the data to the client
    } catch (error) {
        console.error("Error fetching sheet data: (Server Side)", error);
        res.status(500).json({ error: "Failed to fetch sheet data" });
    }
}