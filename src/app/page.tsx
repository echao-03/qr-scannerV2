"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'
import { motion } from "motion/react";


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

export const dynamic = 'force-dynamic';


export default function Home() {
  const [sheetData, setSheetData] = useState<string[][] | null>(null); // Set data into a string
  const [loading, setLoading] = useState<boolean>(true); // Boolean to show if loading sheet data and/or receiving GET 200 from google API
  const [error, setError] = useState<string | null>(null); // Set error into string to display (Not working)
  //  const range = "Sheet1"; // Fetch the entire sheet data
  let attendee: string = NO_USER; // set attendee to a default NO_USER string



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

  const SearchParamsComponent = () => {
    const parameter: string | null | undefined = useSearchParams()?.get("id"); // takes id from url `search` paramter "id"
    // parse through ids in google sheets data to look for a corresponding id parameter
    if (parameter == null) {
      attendee = "NULL"
    } // Edge case to check if there is no ID

    else if (sheetData !== null) {
      for (let i = 0; i < sheetData.length; i++) {
        if (parameter == sheetData[i][SHEET_INDEX.ID]) {
          attendee = sheetData[i][SHEET_INDEX.NAME];
          break;
        }
      }
    }


    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-3xl'
          transition={{ delay: 0.5 }}

        >{attendee == "NULL" ? "Please scan QR for ID"
          : attendee != NO_USER ? "Welcome " + attendee + "!"
            : "Error: ID is not in database, please refer to Master Sheet"}</motion.div>

      </div>
    );
  };


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
        <div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-5xl'
            transition={{ delay: 0.5 }}
          ><h1>Welcome to Matsuri!</h1></motion.div>

        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <SearchParamsComponent />
        </Suspense>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <p>Data Loaded, No errors :)</p>
        )}
      </main>
    </div>
  );
}
