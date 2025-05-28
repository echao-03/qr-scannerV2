"use client";
import React, { useEffect, useState, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";
import { motion } from "motion/react";

const NO_USER: string = "XXXXXXXXXX";

enum SHEET_INDEX {
  ID = 0,
  PAYMENT_STATUS = 1,
  TICKET_STATUS = 2,
  NAME = 3,
  EMAIL_ADDRESS = 4,
  DIETARY_RESTRICTIONS = 5,
}

export const dynamic = "force-dynamic";

export default function Home() {
  const [sheetData, setSheetData] = useState<string[][] | null>(null); // Set data into a string
  const [loading, setLoading] = useState<boolean>(true); // Boolean to show if loading sheet data and/or receiving GET 200 from google API
  const [error, setError] = useState<string | null>(null); // Set error into string to display (Not working)
  let attendee: string = NO_USER; // set attendee to a default NO_USER string
  // let dietaryRestrictions: string = "None"
  // const [ticketType, setTicketType] = useState<string | null>("General"); // Default if there's no input from ticket_type
  useEffect(() => {
    // retrieving sheets and storing into data
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sheets"); // API route to fetch sheet data
        if (!response.ok) {
          throw new Error("");
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
  // Failed to fetch sheet data: (Client Side)
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
          break;
        }
      }
    }

    return (
      <div className="relative z-20 top-1/2 -translate-y-[125%] text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-semibold z-20"
          transition={{ delay: 1 }}
        >
          <h1>Welcome,</h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-5xl text-center max-w-screen-md w-75 text-ellipsis break-words font-semibold "
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
    <div className="grid grid-row-flow text-[#DB9F1C] font-[family-name:var(--font-geist-sans)] w-screen h-screen bg-[#1A1763]">
      <div className="relative w-screen h-screen">
        <motion.div
          className="absolute inset-y-4 inset-x-8 border-4 rounded-xl border-[#ecdab9]"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-y-8 inset-x-4 border-4 rounded-xl border-[#f8dc97]"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <main className="absolute flex flex-col inset-8">
          <Suspense fallback={<p>Loading...</p>}>
            <SearchParamsComponent />
          </Suspense>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <p></p>
          )}
          <div className="absolute bottom-0 w-full h-[50vh] flex">
            <motion.img
              className="absolute bottom-0"
              src="/JSA Prom Assets/Effects Individual/Shadow.png"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            />
            <motion.img
              className="absolute bottom-0"
              src="/JSA Prom Assets/Envelope.png"
              initial={{
                x: "-100vw",
                y: "-100vh",
                scale: 0.5,
                opacity: 0,
              }}
              animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: "easeOut",
                delay: 0.5,
              }}
            />
            <motion.img
              className="absolute bottom-0"
              src="/JSA Prom Assets/Effects Individual/Trail 1.png"
              alt="Top Trail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            />
            <motion.img
              className="absolute bottom-0"
              src="/JSA Prom Assets/Effects Individual/Trail 2.png"
              alt="Middle Trail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            />
            <motion.img
              className="absolute bottom-0"
              src="/JSA Prom Assets/Effects Individual/Trail 3.png"
              alt="Bottom Trail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            />
            <motion.img
              className="absolute bottom-0"
              src="/JSA Prom Assets/Mask_NoShadow.png"
              initial={{ opacity: 0, y: "10vw" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: "easeOut",
              }}
            />
            <motion.img
              className="absolute bottom-0"
              src="/JSA Prom Assets/Effects Individual/Group Stars 1.png"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.img
              className="absolute bottom-0"
              src="/JSA Prom Assets/Effects Individual/Group Stars 2.png"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
