cd frontend
npm install
npm run build
mkdir ../backend/public
mv ./dist/frontend/* ../backend/public
cd ../backend
npm install
npm run build
