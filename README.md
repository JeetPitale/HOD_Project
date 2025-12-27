<div align="center">

# 🌟 Learniverse

### *Empowering Education Through Technology*

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.18-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PHP](https://img.shields.io/badge/PHP-Backend-777bb4?style=for-the-badge&logo=php&logoColor=white)](https://php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479a1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

<p align="center">
  <strong>A modern educational platform built with React and PHP</strong><br>
  Featuring dynamic content management, blogs, and community engagement
</p>

[🚀 Demo](https://vishaldahiya.cs.in/) • [📖 Documentation](#-table-of-contents) • [🐛 Report Bug](#-troubleshooting) • [✨ Request Feature](#-support)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [⚡ Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔐 Admin Access](#-admin-access)
- [🌐 Deployment](#-deployment)
- [🔧 API Reference](#-api-reference)
- [🐛 Troubleshooting](#-troubleshooting)
- [📝 License](#-license)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🌐 Public Features

- 🏠 **Home Page** - Engaging landing experience
- 📝 **Blog System** - Educational content with comments
- 💬 **Comment System** - Interactive discussions
- ℹ️ **About Page** - Mission, vision & team info
- 📧 **Contact Form** - Easy communication channel
- 🤖 **AI Chatbot** - Smart assistance integration

</td>
<td width="50%">

### 🔐 Admin Features

- 🔑 **Secure Login** - Firebase OTP authentication
- ✍️ **Blog Management** - Full CRUD operations
- 🛡️ **Comment Moderation** - Review & manage feedback
- ⚙️ **Content Editor** - Update about page dynamically
- 📊 **Dashboard** - Manage contact submissions
- 🖼️ **Media Upload** - Image management system

</td>
</tr>
</table>

---

## �️ Tech Stack

<div align="center">

### Frontend Technologies

| Technology | Purpose | Version |
|:---:|:---:|:---:|
| ![React](https://img.shields.io/badge/-React-61dafb?style=flat-square&logo=react&logoColor=black) | UI Library | 19.2.0 |
| ![Vite](https://img.shields.io/badge/-Vite-646cff?style=flat-square&logo=vite&logoColor=white) | Build Tool | 7.2.4 |
| ![TailwindCSS](https://img.shields.io/badge/-Tailwind-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white) | Styling | 4.1.18 |
| ![React Router](https://img.shields.io/badge/-React_Router-ca4245?style=flat-square&logo=reactrouter&logoColor=white) | Routing | 7.11.0 |
| ![Firebase](https://img.shields.io/badge/-Firebase-ffca28?style=flat-square&logo=firebase&logoColor=black) | Authentication | 12.7.0 |
| ![Lucide](https://img.shields.io/badge/-Lucide-f56565?style=flat-square&logo=lucide&logoColor=white) | Icons | 0.562.0 |

### Backend Technologies

| Technology | Purpose |
|:---:|:---:|
| ![PHP](https://img.shields.io/badge/-PHP-777bb4?style=flat-square&logo=php&logoColor=white) | Server-side Logic |
| ![MySQL](https://img.shields.io/badge/-MySQL-4479a1?style=flat-square&logo=mysql&logoColor=white) | Database |
| ![Apache](https://img.shields.io/badge/-Apache-d22128?style=flat-square&logo=apache&logoColor=white) | Web Server |

</div>

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

<div align="center">

| Requirement | Version | Download |
|:---:|:---:|:---:|
| 📗 Node.js | v16+ | [Download](https://nodejs.org/) |
| 📦 npm/yarn | Latest | Included with Node |
| 🐘 PHP | v7.4+ | [Download](https://www.php.net/) |
| 🗄️ MySQL | v5.7+ | [Download](https://www.mysql.com/) |
| 🌐 Apache | Latest | [XAMPP](https://www.apachefriends.org/) |

</div>

---

## ⚡ Quick Start

### 🎯 Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "HOD Project"
```

### 📦 Step 2: Install Dependencies

```bash
npm install
```

### 🔑 Step 3: Environment Setup

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_BACKEND_URL=http://localhost/backend
```

> 💡 **Tip:** Copy `.env.example` and rename it to `.env`

### 💾 Step 4: Database Setup

**Create Database:**
```sql
CREATE DATABASE learniverse;
```

**Import Schema:**
```bash
mysql -u your_username -p learniverse < backend/database_schema.sql
```

**Import Sample Data (Optional):**
```bash
mysql -u your_username -p learniverse < backend/import_tables.sql
```

### ⚙️ Step 5: Configure Backend

Edit `backend/db_connect.php`:

```php
$host = 'localhost';
$dbname = 'learniverse';
$username = 'your_username';
$password = 'your_password';
```

### 🚀 Step 6: Run the Application

**Start Frontend:**
```bash
npm run dev
```

**Start Backend:**
- Ensure XAMPP/WAMP is running
- Access at `http://localhost:5173`

---

## 📁 Project Structure

```
📦 HOD Project
┣ 📂 backend/                    # PHP Backend
┃ ┣ 📜 .htaccess                 # Apache config
┃ ┣ 📜 db_connect.php            # Database connection
┃ ┣ 📜 about_api.php             # About page API
┃ ┣ 📜 blog_api.php              # Blog posts API
┃ ┣ 📜 comments_api.php          # Comments API
┃ ┣ 📜 save_contact.php          # Contact handler
┃ ┣ 📜 upload.php                # File uploads
┃ ┣ 📜 database_schema.sql       # DB structure
┃ ┗ 📂 uploads/                  # Media files
┣ 📂 src/
┃ ┣ 📂 assets/                   # Static files
┃ ┣ 📂 components/               # React components
┃ ┣ 📂 context/                  # Context providers
┃ ┃ ┣ 📜 AuthContext.jsx         # Auth state
┃ ┃ ┗ 📜 ToastContext.jsx        # Notifications
┃ ┣ 📂 layout/                   # Layout components
┃ ┃ ┗ 📜 Navbar.jsx              # Navigation
┃ ┣ 📂 pages/                    # Page components
┃ ┃ ┣ 📜 Home.jsx
┃ ┃ ┣ 📜 Blog.jsx
┃ ┃ ┣ 📜 About.jsx
┃ ┃ ┣ 📜 Contact.jsx
┃ ┃ ┗ 📜 AdminLogin.jsx
┃ ┣ 📂 services/                 # API services
┃ ┣ 📜 App.jsx                   # Main component
┃ ┣ 📜 firebase.js               # Firebase config
┃ ┗ 📜 main.jsx                  # Entry point
┣ 📜 .env.example                # ENV template
┣ 📜 package.json                # Dependencies
┣ 📜 vite.config.js              # Vite config
┗ 📜 README.md                   # You are here!
```

---

## 🔐 Admin Access

<div align="center">

### 🔑 Login Credentials

| Field | Value |
|:---:|:---:|
| 📱 **Mobile Number** | `9558611538` |
| 🔐 **OTP** | Fixed OTP via Firebase |

### 🎛️ Admin Capabilities

```mermaid
graph LR
    A[👤 Admin Login] --> B[📝 Blog Management]
    A --> C[💬 Comment Moderation]
    A --> D[⚙️ Content Editing]
    A --> E[📧 Contact Management]
    B --> F[✏️ Create Posts]
    B --> G[🗑️ Delete Posts]
    B --> H[📝 Edit Posts]
    C --> I[✅ Approve Comments]
    C --> J[🗑️ Remove Comments]
```

</div>

---

## 🌐 Deployment

### 🎨 Frontend (Vercel/Netlify)

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

</div>

**Steps:**
1. 🔗 Connect your repository
2. ⚙️ Set environment variables
3. 🚀 Deploy!

### 🗄️ Backend (cPanel/Shared Hosting)

1. 📤 Upload backend files via FTP
2. 💾 Create MySQL database
3. 📋 Import `database_schema.sql`
4. ✏️ Update `db_connect.php` credentials
5. 🔒 Set permissions for `uploads/` directory (755)

---

## 🔧 API Reference

<details>
<summary><b>📝 Blog API Endpoints</b></summary>

| Method | Endpoint | Description | Auth |
|:---:|:---|:---|:---:|
| `GET` | `/blog_api.php` | Fetch all blog posts | ❌ |
| `POST` | `/blog_api.php` | Create new post | ✅ |
| `PUT` | `/blog_api.php` | Update post | ✅ |
| `DELETE` | `/blog_api.php` | Delete post | ✅ |

</details>

<details>
<summary><b>💬 Comments API Endpoints</b></summary>

| Method | Endpoint | Description | Auth |
|:---:|:---|:---|:---:|
| `GET` | `/comments_api.php` | Fetch comments | ❌ |
| `POST` | `/comments_api.php` | Add comment | ❌ |
| `DELETE` | `/comments_api.php` | Delete comment | ✅ |

</details>

<details>
<summary><b>ℹ️ Other Endpoints</b></summary>

| Method | Endpoint | Description | Auth |
|:---:|:---|:---|:---:|
| `GET` | `/about_api.php` | Get about data | ❌ |
| `PUT` | `/about_api.php` | Update about | ✅ |
| `POST` | `/save_contact.php` | Submit contact form | ❌ |
| `POST` | `/upload.php` | Upload images | ✅ |

</details>

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ Backend returns HTML instead of JSON</b></summary>

- ✅ Check `.htaccess` configuration
- ✅ Disable PHP error display in production
- ✅ Verify backend URL in `.env`

</details>

<details>
<summary><b>🔌 Database connection errors</b></summary>

- ✅ Verify credentials in `db_connect.php`
- ✅ Ensure MySQL service is running
- ✅ Check if database exists
- ✅ Verify user permissions

</details>

<details>
<summary><b>🔥 Firebase authentication issues</b></summary>

- ✅ Check Firebase config in `src/firebase.js`
- ✅ Verify environment variables
- ✅ Ensure Firebase project is configured
- ✅ Check OTP phone number authentication settings

</details>

<details>
<summary><b>🖼️ Images not loading</b></summary>

- ✅ Check `backend/uploads/` permissions (755)
- ✅ Verify upload path configuration
- ✅ Ensure web server has write access

</details>

---

## 📊 Development Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | 🚀 Start development server |
| `npm run build` | 📦 Build for production |
| `npm run preview` | 👀 Preview production build |
| `npm run lint` | 🔍 Run ESLint |

---

## 📝 License

<div align="center">

📚 **Academic Project**

This project is developed as part of TY SEM-6 HOD Project

</div>

---

## 👥 Contributors

<div align="center">

### 🌟 Development Team

*TY SEM-6 HOD Project*

Made with ❤️ and ☕ by the Learniverse Team

</div>

---

## 📞 Support

<div align="center">

Got questions? We're here to help!

[![Contact](https://img.shields.io/badge/Contact-Form-blue?style=for-the-badge)](https://vishaldahiya.cs.in/contact)
[![Email](https://img.shields.io/badge/Email-Support-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:support@learniverse.com)

</div>

---

<div align="center">

### ⭐ Star us on GitHub — it motivates us a lot!

**[⬆ Back to Top](#-learniverse)**

---

*Last Updated: December 2025*

</div>
