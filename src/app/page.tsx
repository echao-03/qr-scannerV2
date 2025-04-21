"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'
const NO_USER: string = "XXXXXXXXXX";

enum SHEET_INDEX {
  ID = 0,
  NAME = 1,
  EMAIL_ADDRESS = 2,
  PAYMENT_STATUS = 3,
  EMAIL_STATUS = 4,
  TICKET_TYPE = 5,
  DIETARY_RESTRICTIONS = 6,
}

export default function Home() {
    const [sheetData, setSheetData] = useState<string[][] | null>(null); // Set data into a string
    const [loading, setLoading] = useState<boolean>(true); // Boolean to show if loading sheet data and/or receiving GET 200 from google API
    const [error, setError] = useState<string | null>(null); // Set error into string to display (Not working)
    //  const range = "Sheet1"; // Fetch the entire sheet data
    let attendee: string = NO_USER; // set attendee to a default NO_USER string

    const SearchParamsComponent = () => {
        const parameter: string | null | undefined = useSearchParams()?.get("id"); // takes id from url `search` paramter "id"

        // parse through ids in google sheets data to look for a corresponding id parameter
        if (sheetData !== null) {
            for (let i = 0; i < sheetData.length; i++) {
                if (parameter == sheetData[i][SHEET_INDEX.ID]) {
                    attendee = sheetData[i][SHEET_INDEX.NAME];
                }
            }
        }
        return (
            <div>
                {"The parameter is: " + parameter}
                <div>
                    {attendee !== NO_USER
                        ? "This ID matches with: " + attendee
                        : "This ID does not match with anyone on Google Sheets"}
                </div>
            </div>
        );
    };

    useEffect(() => {
        // retrieving sheets and storing into data
        const fetchData = async () => {
            try {
                const response = await fetch("/api/sheets"); // API route to fetch sheet data
                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch sheet data: (Client Side)"
                    );
                }
                const data = await response.json();
                setSheetData(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);




    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <h1>Google Sheets Data</h1>
                <Suspense fallback={<p>Loading...</p>}>
                    <SearchParamsComponent />
                </Suspense>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : sheetData ? (
                    <table className="border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                {sheetData[0].map((header, index) => (
                                    <th
                                        key={index}
                                        className="border border-gray-300 p-2"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sheetData.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="border border-gray-300 p-2"
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data found.</p>
                )}
                <div className="my-2">
                    {attendee !== NO_USER
                        ? "this id matches with: " + attendee
                        : "this id does not match with anyone in the google sheets data"}
                </div>
            </main>
        </div>
    );
}
