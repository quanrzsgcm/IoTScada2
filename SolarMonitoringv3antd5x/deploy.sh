echo "Switching to "

echo "buidling app"

npm run build

scp -r build/* pmq@159.223.78.150:/var/www/159.223.78.150/

echo "Done"
