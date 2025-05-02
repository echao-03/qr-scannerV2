"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";
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



export const dynamic = "force-dynamic";

export default function Home() {
  const [sheetData, setSheetData] = useState<string[][] | null>(null); // Set data into a string
  const [loading, setLoading] = useState<boolean>(true); // Boolean to show if loading sheet data and/or receiving GET 200 from google API
  const [error, setError] = useState<string | null>(null); // Set error into string to display (Not working)
  let attendee: string = NO_USER; // set attendee to a default NO_USER string
  // let dietaryRestrictions: string = "None"
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string | null>("None");
  const [ticketType, setTicketType] = useState<string | null>("General"); // Default if there's no input from ticket_type
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const SearchParamsComponent = () => {
    const parameter: string | null | undefined =
      useSearchParams()?.get("id"); // takes id from url `search` paramter "id"
    // parse through ids in google sheets data to look for a corresponding id parameter
    if (parameter == null) {
      attendee = "NULL";
    } // Edge case to check if there is no ID
    else if (sheetData !== null) {
      for (let i = 0; i < sheetData.length; i++) {
        if (parameter == sheetData[i][SHEET_INDEX.ID]) {
          attendee = sheetData[i][SHEET_INDEX.NAME];
          setDietaryRestrictions(sheetData[i][SHEET_INDEX.DIETARY_RESTRICTIONS]);
          setTicketType(sheetData[i][SHEET_INDEX.TICKET_TYPE]);
          break;
        }
      }
    }

    return (
      <div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl text-center max-w-screen-md w-64 text-center text-ellipsis break-words font-semibold"
          transition={{ delay: 1 }}
        >
          {attendee == "NULL"
            ? "Please scan QR Code."
            : attendee != NO_USER
              ? attendee
              : "Error: ID is not in database, please refer to Master Sheet"}
        </motion.div>



      </div>

    );
  };

  // return div starts here
  return (
    <div className="grid grid-row-flow text-black font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start bg-[#F0E5C9] w-screen h-screen">
        <motion.div
          className="absolute aspect-square w-[70vw] rounded-full bg-[#e82b29] top-[-20vw] left-[-15vw]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.img
          className="absolute bottom-0 object-contain w-full h-auto"
          src="/pagoda_landscape1.png"
          alt="pagoda cropped"
          initial={{ y: 500, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          sizes="100vw"
        />
        <div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-semibold relative z-20 text-center top-[10vw]"
            transition={{ delay: 1 }}
          >
            <h1>
              {ticketType == "volunteer/performer"
                ? "thank you"
                : ticketType == "alumni"
                  ? "you're back?"
                  : "welcome"}
            </h1>
          </motion.div>
        </div>
        <div className="relative z-20 top-[10vw]">
          <Suspense fallback={<p>Loading...</p>}>
            <SearchParamsComponent />
          </Suspense>
        </div>

        <div className="relative w-full h-screen top-10">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl  w-64 p-4 text-base break-words"
            transition={{ delay: 2.5 }}
          >
            <h5>Dietary Restrictions: {dietaryRestrictions}</h5>
          </motion.div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <p>Data Loaded, No errors</p>
        )}

      </main>

    </div>
  );
}
