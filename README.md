# Smart City

All-in-one MERN app.

What it does
- Recycle: upload item photo, AI analyzes.
- Safety: make events, join, send text/image reports (AI acts).
- Auth: register/login (JWT).

Run it
1) Backend
- Needs: Node 18+, MongoDB, Google Gemini API key
- Create backend/.env
	- MONGO_URI=your_mongo_uri
	- JWT_SECRET=any_secret
	- GEMINI_API_KEY=your_key
	- PORT=5000
- cd backend; npm install; npm start

2) Frontend
- Create frontend/.env.local
	- NEXT_PUBLIC_API_URL=http://localhost:5000/api
- cd frontend; npm install; npm run dev

Test (backend)
- cd backend; npm test