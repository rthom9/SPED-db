echo "Pulling changes"
git pull

echo "Restarting Forever Server"
./node_modules/forever/bin/forever restart app.js