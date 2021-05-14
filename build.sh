cd frontend
npm ci
npm run build
mkdir ../backend/public
mv ./dist/frontend/* ../backend/public
cd ../backend
npm ci
npm run build
