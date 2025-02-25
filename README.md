# Smart Scale SAAS

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Demo

see this live at here - https://smart-scale.vercel.app/

## Features

- Signup/ Login through verification code via email
- The video can be viewed and can be downloaded in a compressed size
- A user can edit an image according to his/her preference (like selecting the image size format, enhencing the image, remove or fill the background etc)
- A user can compress any type of images
- Anyone can see all the videos uloaded in this app, without signing in . but can't do any other activities.

## Tech Stack

**In this Next.js application, the frontend and backend are tightly integrated within the same project.**

**frontend:** defined under the _app_ directory

**backend:** in the app/api directory

**Deployment:** [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

**Others:**

- for authentication , and Email verification - [Clerk Authentication](https://clerk.com)
- for ui design [Daisy UI](https://daisyui.com/)
- for storing videos - [Pisma ORM](https://www.prisma.io/) with [Neon.tech](https://neon.tech/) that uses PostgreeSQL.
- for image uploading - [Cloudinary](https://cloudinary.com/)
- for all the image and video features - [Next Cloudinary](https://next.cloudinary.dev/).

## Screenshots

![Smart Scale SAAS](https://github.com/supriyarani-dhal/smart-scale/blob/main/public/smart_scale.png)

## Feedback

If you have any feedback, please reach out to us at supriyadhal50@gmail.com

## Made by

- [@supriyarani-dhal](https://github.com/supriyarani-dhal)

## Run Locally

Clone the project

```bash
  git clone https://github.com/supriyarani-dhal/smart-scale.git
```

Go to the project directory

```bash
  cd smart-scale
```

Install dependencies

```bash
  npm install
```

Run the react app

```bash
  npm run dev
```
