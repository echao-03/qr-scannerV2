"use client";

import Image from "next/image";
import { google } from "googleapis";
import { useEffect, useState } from "react";

export default function Home() {
  const [sheetData, setSheetData] = useState<string[][] | null>(null); // Set data into a string
  const [loading, setLoading] = useState<boolean>(true); // Boolean to show if loading sheet data and/or receiving GET 200 from google API
  const [error, setError] = useState<string | null>(null); // Set error into string to display (Not working)
  const range = "Sheet1"; // Fetch the entire sheet data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sheets"); // API route to fetch sheet data
        if (!response.ok) {
          throw new Error("Failed to fetch sheet data: (Client Side)");
        }
        const data = await response.json();
        setSheetData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
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
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : sheetData ? (
          <table className="border-collapse border border-gray-300">
            <thead>
              <tr>
                {sheetData[0].map((header, index) => (
                  <th key={index} className="border border-gray-300 p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sheetData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 p-2">
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
      </main>
    </div>
  );
}
