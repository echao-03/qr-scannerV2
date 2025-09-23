# QR-Scanner / Digital Ticketing System

The QR-Scanner is a web application that utilizes Google Sheets API data as our backend, and visualizes it using React for our frontend.

**Tech Stack**

- React (JavaScript)
- Python
- Google API

## How does it work?

The host that wants to hold an event will create a Google Form that is linked to a Google Sheet, allowing guests/participants to input their information and filling the Google Sheet with data. Attached to this application is a Python script, pulling data from the Google Sheet and sending a QR code to each guests/participants. All guests will receive an email of a QR code, a digital ticket.

The host can scan each guests/participants QR code, displaying the guest/participant's name and other information that is needed ie. dietary restrictions, ticket type, etc.

## What problems did we encounter?

The main issue of this application is authenticating the host to utilize their Google API data, as it requires them to create an API key via Google Cloud, and obtaining the Google Sheet key. As a result, this bottlenecks our application to be 'hardcoded' for each event.

## Why did we make this?

We created this as an alternative to having physical tickets for in-person events, while also providing a seamless pipeline for guests to receive their tickets. This cuts the cost of supplying physical tickets and designing.

## Functions to implement

- **Easier authentication**: Make it seamless for hosts to authenticate their account, and able to grab their API keys without having to manually configure it.
