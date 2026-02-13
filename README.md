Food Ordering Web Application

A modern and scalable Food Ordering Web Application built using Next.js
(App Router), React, and Redux Toolkit. This application allows users
to browse food items, add to cart, manage addresses, and place orders
with a smooth and responsive UI.

------------------------------------------------------------------------

Tech Stack

Frontend: Next.js 16, React State Management: Redux Toolkit Styling:
Bootstrap 5 HTTP Client: Axios Notifications: React Toastify Date
Handling: Moment.js Linting: ESLint

------------------------------------------------------------------------

Features

-   User Authentication (Login System)
-   Protected Routes
-   Add to Cart / Remove from Cart
-   Order Placement Flow
-   Profile Management
-   Address Management
-   Toast Notifications
-   Loading Indicators
-   Fully Responsive Design

------------------------------------------------------------------------

Installation

1.  Clone the repository: git clone cd project-folder

2.  Install dependencies: npm install

3.  Create environment file (.env):
    NEXT_PUBLIC_API_URL=your_backend_api_url

------------------------------------------------------------------------

Run the Project

Development Mode: npm run dev

Open in browser: http://localhost:3000

Production Build: npm run build npm run start

------------------------------------------------------------------------

State Management

Redux Toolkit is used for global state management.

Included Slices: - authSlice - cartSlice - menuSlice - addressSlice

------------------------------------------------------------------------

Author

Deepak Nayak Full Stack MERN Developer

📂 Project Structure:

src/
│
├── app/                  # Next.js App Router Pages
│   ├── cart/
│   ├── login/
│   ├── order/
│   ├── profile/
│   ├── layout.js
│   └── page.js
│
├── components/           # Reusable Components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── ItemCard.js
│   ├── ProtectedRoute.js
│   └── ...
│
├── redux/                # Redux Store & Slices
│   ├── store.js
│   ├── ReduxProvider.js
│   └── slices/
│       ├── authSlice.js
│       ├── cartSlice.js
│       ├── menuSlice.js
│       └── addressSlice.js
│
├── services/             # API & Config
│   ├── api.js
│   ├── auth.js
│   └── config.js
│
└── styles/               # Custom CSS

