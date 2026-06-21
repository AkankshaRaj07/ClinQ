# ClinQ - Real-Time Clinic Queue Management System

ClinQ is a robust, real-time clinic queue management system built for speed and consistency. It empowers receptionists to manage patient queues seamlessly and provides patients with live updates and estimated wait times.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas, Mongoose
- **Real-time**: Socket.IO

## Features
- **Receptionist Dashboard**: Add patients, generate tokens, call next, skip, and complete consultations.
- **Patient View**: Real-time queue tracker with estimated wait time and live status updates.
- **Concurrency Safe**: Atomic database operations to prevent race conditions when multiple receptionists are active.
- **Smart Wait Times**: Calculates estimated wait times based on a moving average of recent consultations.
- **Analytics**: Basic daily insights on patient flow and average consultation times.

> **Note on Authentication:** Authentication has been intentionally omitted in the MVP to prioritize queue reliability, real-time synchronization, and wait-time estimation.

*See `implementation_plan.md` for a detailed breakdown of the architecture, schemas, and APIs.*
