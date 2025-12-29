<div align="center">

<br/>

  <img src="https://readme-typing-svg.demolab.com?font=Rubik+Iso&weight=900&size=60&duration=3000&pause=1000&color=D32F2F&center=true&vCenter=true&width=800&lines=The+C.L.A.U.S.+Console" alt="The C.L.A.U.S. Console" />

  <br/>
  <br/>

  <img src="https://media.giphy.com/media/3ofT5EtPNBpIjC8jTy/giphy.gif" width="100%" alt="Santa Animation"/>

  <br/>

  <p>
    <a href="https://claus-console.vercel.app/">
      <img src="https://img.shields.io/badge/VISIT_THE_NORTH_POLE-LIVE_ACCESS-FF0000?style=for-the-badge&logo=vercel&logoColor=white" alt="Visit Live App" />
    </a>
  </p>

  <p>
    <code>Authentication</code> • <code>Handwritten Letter Recognition</code> • <code>3D Generation</code> • <code>Augmented Reality</code> • <code>Real-Time Chat</code>
  </p>

  <br/>

> **⚠️ Performance Note**: This application uses high-fidelity **WebGL & Three.js 3D animations**, so for the best visual experience, we recommend exploring the **Landing Page on a Laptop/Desktop** and using **minimum spec mobile devices** for the **AR Gift Preview & Camera/Scanning features**.

</div>

<hr />

## 🎁 About The Project

**The C.L.A.U.S. Console** (Command Logic & Authorized User System) is the comprehensive digital transformation initiative for North Pole Industries.

### 🎅 The "Real-World" Problem

For centuries, the North Pole relied on a high-latency, analog infrastructure of manual scroll-keeping and physical mail. In a modern digital world, this legacy system eventually reached its breaking point, suffering from several critical bottlenecks:

-   **Too Many Letters**: Santa gets millions of handwritten letters, and reading them all takes forever.
-   **The "Mystery" Gift**: Kids didn't know exactly what they would get or what it would look like until Christmas morning.
-   **Will It Fit?**: Sometimes kids ask for giant toys (like drum sets) without knowing if they'll actually fit in their room.
-   **No Direct Contact**: There was no way to talk to Santa in real-time. Kids never knew if they were on the Naughty or Nice list or how Santa felt about their behavior!

### 💡 The Solution

The C.L.A.U.S. Console is the high-tech upgrade the North Pole needed.

-   **Scan & Send**: Snap a photo or upload your handwritten letter. It zooms straight to Santa's Factory instantly!
-   **Magic Toy Generator**: Our AI reads your wish and creates a 3D model of it. You check it, and if it's perfect, the elves get to work.
-   **AR Room Preview**: Once the toy is ready, use your phone to see it magically appear in your room. Check if it fits before Christmas morning!
-   **Live Santa Chat**: Talk to Santa in real-time! Send wishes, explain your behavior, or just say hi through a direct secure line.

> _"Modernizing magic, one wish at a time."_

## 🗺️ App Workflow

Explore the digital North Pole through these key terminals:

### 1. 🏠 Landing Zone

**File:** `client/src/pages/user/UserHome.tsx`
The entry point for all authorized users.

-   **Experience**: Users are greeted with festive "Jingle Bells" background music.
-   **Visuals**: Features high-fidelity 3D animations with Three.js of Santa's route path and interactive scrolling scenes.
-   **Authentication**: Secure Firebase Google Auth enables simple join without any credentials.
-   **Action**: Gateways to all other console features start here.

### 2. 📸 Letter Scanner

**File:** `client/src/pages/user/ScannerPage.tsx`
The sophisticated input terminal for physical wishes.

-   **Function**: Users scan their handwritten letters using the device camera or file upload.
-   **Process**: The letter content is recognized by our Gemini 2.5 Flash model, which extracts the letter sender's name, their emotional tone and sentiment, and the requested gift name.

### 3. 🧩 Magic Processing

**File:** `client/src/pages/user/ScanResultPage.tsx`
Where AI meets Christmas magic.

-   **Generation**: The letter content is passed through the system and procedurally generates a 3D toy model representation using Tripo AI model.
-   **Approval**: Users review the generated 3D toy model using an interactive Three.js animation viewer from all angles and can approve or reject to begin fabrication.

### 4. 📜 The Manifest

**File:** `client/src/pages/user/ApprovedWishesPage.tsx`
The official registry of granted requests.

-   **Tracking**: View all generated approved wishes status and lists of gifts.
-   **Status**: Monitor the updates and fabrication progress for each approved wish.

### 5. 🪄 AR Room Preview

**File:** `client/src/pages/user/SingleWishPage.tsx`
Bringing the gift home (virtually) before Christmas.

-   **Elf Gamification**: Once Santa approves, the elves begin their work. While waiting for the build to complete, play a mini-game to boost the elves' energy and speed up production!
-   **Augmented Reality**: Once built, project the 3D toy into your physical room.
-   **Verification**: Ensure the gift fits on the shelf (or in the garage) using cutting-edge WebXR.

### 6. 💬 SantaComms (Real-Time)

**File:** `client/src/components/CommLinkWidget.tsx`
The direct line to the Big Guy.

-   **Live Chat**: A secure, WebSocket-encrypted channel for real-time negotiation.
-   **Status**: Discuss "Naughty/Nice" standing or update wish details instantly.

### 7. 🎅 Santa Command Dashboard

**File:** `client/src/pages/santa/SantaDashboard.tsx`
The central command center for North Pole operations.

-   **Overview**: Real-time dashboard displaying global wish fabrication status and logistics.
-   **Statistics**: Monitor total wishes, pending reviews, production approvals, and naughty list entries.
-   **Management**: Direct access to manage the wish queue and open communication channels.
-   **Visual Interface**: Cyber-themed command OS interface with live status indicators and festive animations.

## 📹 Video Demonstrations

See the C.L.A.U.S. Console in action!

> **Click the thumbnails below to watch the demos on YouTube.**

|                                 **Full Website Walkthrough**                                  |                                 **Mobile AR & Letter Scanning**                                 |
| :-------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
| [![Website Demo](https://img.youtube.com/vi/ZiDnEWMMCN4/0.jpg)](https://youtu.be/ZiDnEWMMCN4) | [![Mobile AR Demo](https://img.youtube.com/vi/X_Zb40xF_xw/0.jpg)](https://youtu.be/X_Zb40xF_xw) |
|                               _Desktop Dashboard & SantaComms_                                |                                 _Real-time AR & Camera Capture_                                 |

## 📸 Functionality Showcase

### 🔮 3D Generation (AI-to-Toy)

See how the C.L.A.U.S. Console interprets written wishes into production-ready 3D blueprints.

|                                                                   |                                                                   |                                                                   |
| :---------------------------------------------------------------: | :---------------------------------------------------------------: | :---------------------------------------------------------------: |
| <img src="client/public/screenshots/3D/3D%201.png" width="200" /> | <img src="client/public/screenshots/3D/3D%202.png" width="200" /> | <img src="client/public/screenshots/3D/3D%203.png" width="200" /> |
| <img src="client/public/screenshots/3D/3D%204.png" width="200" /> | <img src="client/public/screenshots/3D/3D%205.png" width="200" /> | <img src="client/public/screenshots/3D/3D%206.png" width="200" /> |

### 👓 AR Experience (In-Room)

The final verification step: bringing the north pole into your living room.

|                                                                   |                                                                   |                                                                   |
| :---------------------------------------------------------------: | :---------------------------------------------------------------: | :---------------------------------------------------------------: |
| <img src="client/public/screenshots/AR/AR%201.PNG" width="200" /> | <img src="client/public/screenshots/AR/AR%202.JPG" width="200" /> | <img src="client/public/screenshots/AR/AR%205.JPG" width="200" /> |

<hr />

### 📝 Official Scan Template

You can use this letter template, or write your own handwritten letter! Santa actually prefers handwritten notes over digital text—they have more Christmas spirit.

<div align="center">
  <img src="client/public/images/template.jpg" width="400" alt="Santa Letter Template" />
</div>

## 🛠️ Tech Stack

This project leverages a modern **MERN** stack and **Generative AI** with powerful extensions for 3D and real-time communication.

<div align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,vite,ts,tailwind,nodejs,express,mongodb,firebase,threejs,vercel" />
  </a>
</div>

| Domain       | Technologies                                                                                                                  |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | React 19, Vite, TailwindCSS v4, Framer Motion, Three.js (@react-three/fiber), Google Model Viewer, React Router, Lucide React |
| **Backend**  | Node.js, Express, Mongoose (MongoDB), Socket.io                                                                               |
| **Services** | Firebase (Auth), Cloudinary (Media), Google Gemini AI (Intelligence), Tripo AI (3D Models)                                    |

## ✨ Key Features

-   **🪄 AR Gift Preview**: visualize your 3D wishes in the real world using WebXR.
-   **💬 SantaComms**: Direct, real-time WebSocket chat with Santa Claus.
-   **📜 Smart Wishlist**: Create, manage, and track your holiday wishes.
-   **📱 Responsive & Interactive**: A "wow" UI with glassmorphism, animations, and mobile-first design.
-   **🔒 Secure Access**: Firebase Authentication ensures only good kids get in.

## 🚀 How to Run

Clone the repository to your local machine:

```bash
git clone https://github.com/Rahul-R79/The-C.L.A.U.S.-Console.git
```

### 1. 🛠️ Client Setup

Navigate to the client folder and set up the environment variables:

```bash
cd client
cp .env.example .env
npm install
```

**Required Variables (`client/.env`):**

```env
VITE_SANTA_USERNAME=santa@claus.com
VITE_SANTA_PASSWORD=hohoho2025
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Run the frontend:

```bash
npm run dev
```

### 2. ⚙️ Server Setup

Navigate to the server folder and configure the backend:

```bash
cd server
cp .env.example .env
npm install
```

**Required Variables (`server/.env`):**

```env
PORT=8080
MONGODB_URI=...
GEMINI_API_KEY=...
TRIPO_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

Run the backend:

```bash
npm run dev
```

The client usually runs on `http://localhost:5173` and the server on `http://localhost:8080`.

## 📜 License

Distributed under the ISC License. See [LICENSE](./LICENSE) for more information.

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=d32f2f&height=100&section=footer" width="100%"/>
  <p>Hand crafted with ❤️ by <a href="https://github.com/Rahul-R79">@Rahul-R79</a></p>
</div>
