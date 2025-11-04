# FlipDots Calorie Tracker

An interactive calorie tracking web application that connects to a Flipdots board to visualize user progress through growing or wilting plants. Built with Next.js and Tailwind CSS, this project combines digital tracking and physical visualization to motivate users toward their health goals.

## Project Overview

The FlipDots Calorie Tracker allows users to set daily calorie goals, log their intake, and watch their progress in real time. The Flipdots board visually represents progress:

- Growing plants for users who reach their goals.
- Wilting plants for users falling behind.

The goal is to create a fun, interactive experience that motivates users while showcasing the creative possibilities of Flipdots boards.

## Features

- **Dashboard** (Works within the hardware constraints of 84×28 pixels and 15 fps)
- Set daily calorie goals
- Log calories manually or using custom presets
- View daily and monthly progress
- Unlock rewards (like new seeds or plant types) for consistent achievement
- **Flipdots Board Integration**
  - Visualizes user progress as plant growth or wilting
  - Syncs with dashboard data in real time

## Tech Stack

- **Next.js** – Framework for frontend and backend integration
- **Tailwind CSS** – Utility-first CSS framework for responsive design
- **Node.js** – Backend runtime for handling data and API requests
- **Flipdots API / Database** – Connects dashboard data to the Flipdots board
- **Figma** – For interface and visual design prototyping

## Out of Scope

- Full nutrition/calorie product database
- Integration with wearable devices or advanced health features
- Native mobile apps
- Medical or dietary validation

## Setup

### Installation

```bash
# Clone the repository
git clone https://github.com/jarvin-s/group-project-owow.git
cd flipdots-calorie-tracker

# Install dependencies
npm install

# Run development server
npm run dev






This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
