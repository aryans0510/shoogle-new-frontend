# Shoogle Front-End

This repository only contains the code for frontend.

## Tech Stack

**React**: Framework used to built Single Page Applications.  
**Deno**: Currently supabase uses Deno, so make sure you have VS Code's Deno extension installed until the backend migration is complete.  
**Supabase**: Currently, the backend is on supabase which is a BaaS, but we are moving this to custom Node.js + Typescript which will be hosted on AWS.

## Local Development

#### Follow the below steps to quickly setup the frontend

1. Clone the repository

```bash
git clone https://github.com/sannnkallp/shoogle-frontend
```

2. Install dependencies

```bash
cd shoogle-frontend
npm install
```

3. Setup .env variables

```bash
# Backend API URL
   VITE_BASE_URL=http://localhost:3000
```

4. Run the `dev` script

```bash
npm run dev
```

---

End of README.md
