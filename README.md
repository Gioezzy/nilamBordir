# Embroidery Services

<div align="center">
  <img src="https://res.cloudinary.com/dyfi4bwkp/image/upload/v1763913339/Screenshot_from_2025-11-23_22-54-11_ctyaey.png" alt="Embroide Master Logo" width="1200"/>
</div>

<p align="center">
  <strong>An E-commerce Platform for Custom Embroidery Services</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project_Status-Active-brightgreen?style=for-the-badge" alt="Project Status"/>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"/>
</p>

---

Embroide Master is a modern e-commerce platform built with Next.js, specializing in providing custom embroidery services. Customers can browse products, upload their own designs, and place orders seamlessly. The project also features a robust admin panel for managing products, orders, and site content.


## ✨ Features

-   **User Authentication**: Secure registration and login process, including social login with Google.
-   **Product Browsing**: Users can search, filter, and sort through products.
-   **Custom Design Upload**: An intuitive interface for users to upload their own embroidery designs and specify customization details.
-   **Shopping Cart & Checkout**: A persistent shopping cart and a secure checkout process integrated with Midtrans.
-   **User Dashboard**: Users can view their order history, manage their profile, and track order statuses.
-   **Admin Panel**: A comprehensive dashboard for admins to manage products, categories, orders, and design reviews.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database & Auth**: [Supabase](https://supabase.io/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Image Storage**: [Cloudinary](https://cloudinary.com/)
-   **Payment Gateway**: [Midtrans](https://midtrans.com/)
-   **Form Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the latest version of [Node.js](https://nodejs.org/) and your preferred package manager (npm, yarn, or pnpm) installed.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Gioezzy/nilamBordir.git
    cd nilam-bordir
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

1.  Copy the `.env.example` file to a new file named `.env.local`:
    ```bash
    cp .env.example .env.local
    ```

2.  Open the `.env.local` file and fill in the required variables:
    -   **Supabase**: Get your project URL and `anon` key from your Supabase dashboard.
    -   **Cloudinary**: Get your cloud name, API key, and API secret from your Cloudinary dashboard.
    -   **Midtrans**: Get your server key and client key from your Midtrans dashboard.

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

    # Midtrans
    MIDTRANS_SERVER_KEY=YOUR_MIDTRANS_SERVER_KEY
    MIDTRANS_CLIENT_KEY=YOUR_MIDTRANS_CLIENT_KEY
    MIDTRANS_IS_PRODUCTION=false
    ```

## 🏃 Running the Project

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Other Commands

-   **Build for Production**:
    ```bash
    npm run build
    ```

-   **Start Production Server**:
    ```bash
    npm run start
    ```

-   **Lint Code**:
    ```bash
    npm run lint
    ```

## 🌐 API Endpoints Overview

The application exposes several API endpoints for various functionalities:

-   `/api/admin/categories`: CRUD operations for product categories (Admin only).
-   `/api/admin/products`: CRUD operations for products (Admin only).
-   `/api/admin/orders`: Update order status (Admin only).
-   `/api/designs`: Create new design uploads, update design status (Admin only).
-   `/api/upload-image`: Handles image uploads to Cloudinary.
-   `/api/test`: Cloudinary connection test endpoint.

## ☁️ Deployment

This project is designed to be easily deployed on [Vercel](https://vercel.com), the creators of Next.js.

1.  Push your repository to GitHub.
2.  Connect your GitHub repository to Vercel.
3.  Configure your environment variables on Vercel.
4.  Deploy!

## 📂 Project Structure

Here is an overview of the main directory structure:

```
/
├── app/                # Main routes, pages, and layouts
│   ├── (auth)/         # Authentication-related routes
│   ├── (main)/         # Main public-facing pages
│   ├── (protected)/    # Protected routes (user dashboard)
│   └── admin/          # Routes and pages for the admin panel
│   └── api/            # API routes
├── components/         # Reusable React components
│   ├── forms/          # Form components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   └── ...
├── lib/                # Utility functions, server actions, and Supabase client
│   ├── actions/        # Next.js Server Actions
│   └── supabase/       # Supabase clients and types
└── public/             # Static assets (images, icons)
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📧 Contact

Project Link: [https://github.com/Gioezzy/nilamBordir](https://github.com/Gioezzy/nilamBordir)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Gioezzy">Gioezzy</a>
</p>
