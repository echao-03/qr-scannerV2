import { google } from "googleapis";
import { NextResponse } from "next/server"; // App Router uses this instead

export async function GET() {
    try {
	const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON || "{}");
	credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

        const auth = new google.auth.GoogleAuth({
            credentials,  // Used for deployment, does NOT work locally
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
	

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;
        const range = "Sheet1";

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const rows = response.data.values || [];

        const headers = rows[0];
        const dataRows = rows.slice(1);

        const filteredData: string[][] = [];

        for (const row of dataRows) {
           filteredData.push(row) 

        }

        return NextResponse.json([headers, ...filteredData]);
    } catch (error) {
        console.error("Error fetching sheet data: (Server Side)", error);
        return NextResponse.json(
            { error: "Failed to fetch sheet data" },
            { status: 500 }
        );
    }
}
