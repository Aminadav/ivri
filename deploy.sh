git add .
git commit -m "autocommit"
git push
echo This deploy the frontend

ssh root@104.154.78.142 "cd /home/ivri; git pull"
ssh root@104.154.78.142 "cd /home/ivri; CI=true pnpm i"
ssh root@104.154.78.142 pm2 reload ivri