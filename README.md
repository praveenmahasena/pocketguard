# 💸 PocketGuard — Budget Tracking App

PocketGuard is a full-stack budgeting application designed to help users **track their income, expenses, and savings goals** — all in one place. With a clean green-themed interface, PocketGuard makes managing personal finances simple, transparent, and accessible.

## 🌟 Features

- ✅ **User Authentication** (JWT-based, stored in cookies)
- 💰 **Income Tracking** — Add & visualize monthly earnings
- 🧾 **Expense Tracking** — Record daily expenses with type & place
- 💡 **Savings View** — See how much you've saved each month
- 🎯 **Set Savings Goals** and track progress
- 📊 **Chart Visualizations** via Chart.js
- ⚙️ **User Settings** — Change name, update password, logout

## 🖼️ Tech Stack

### 🔧 Backend
- **Node.js + Express**
- **PostgreSQL** with `pg`
- **JWT Authentication**
- **bcryptjs** for secure password hashing

### 🎨 Frontend
- **React + TypeScript**
- **Tailwind CSS** (green theme)
- **Axios** for HTTP requests
- **Chart.js** for income & savings visualizations

## Setup Instructions
 - Install [Node.js](https://nodejs.org) and npm.
 - Install [PostgreSQL](https://www.postgresql.org/download/).
 - Install [Git](https://git-scm.com/).

## Clone the Repository
## Backend Setup

 1. ### Clone repo

    ```bash
    git clone https://github.com/praveenmahasena/chat_auth.git
    ```

 2. ### Change working dir

    ```bash
    cd /server
    ```

 3. ### Install dependency

    ```bash
    npm install
    ```

 4. ### Migrate DB
    use [psqltool](https://github.com/praveenmahasena/sqltool/d) to do migration

 5. ### Config
    These properties goes into .env file

    ```bash
     PORT=
     DB_NAME=
     DB_USR=
     DB_HOST=
     DB_PASSWORD=
     DB_PORT=
     DB_SSL=
     JWT_KEY=

    ```

 6. Start the backend in development mode server

    ```bash
    npm run dev
    ```

 7. Start the backend in prod mode server

    ```bash
    npm run prod
    ```

## Frontend Setup

 1. ### Change working dir

    ```bash
    cd /frontend
    ```

 2. ### Install dependency

    ```bash
    npm install
    ```

 3. ### build

    ```bash
    npm run build
    ```

