# School Management API (Node.js + Express + SQLite)

## Install
npm install

## Seed DB (optional)
npm run seed

## Run
npm start
# or for development with auto-reload:
npm run dev

## Endpoints
### POST /addSchool
Body (JSON): { "name": "ABC", "address": "Addr", "latitude": 17.38, "longitude": 78.48 }

### GET /listSchools?latitude=17.40&longitude=78.48
Response: JSON list of schools sorted by distance (field `distance` in km)

