# IVRI

Create yearly reminders on Google Calendar using the Hebrew Date:

- https://ivri.boti.bot

PR's are welcome

## Frontend
If you would like to work only on the frondend you can just install it:

```sh
cd frontend
npm i
npm run start
```

It will connect to our server.

If you want to connect it to your backend:

```sh
REACT_APP_BACKEND=http://yourserver.com npm run start
```

## Backend
If you wish to work on the backend you need to install both

```sh
cd backend
npm i
node ivri.js
```

You need a MYSQL datbase on port 3300. It's better if it was configurated using an environment variable. (Idea for a PR)

To be able to connect to google you need an `.env` file in your backend folder:

```sh
GOOGLE_CLIENT_ID=108778709679-mvnp8sesar8.....
GOOGLE_SECRET=......
REDIRECT_URI=https://api-ivri.boti.bot/callback_oauth
```

You can get this detailes by creating a OAuth client in Google Cloud Console

# Link:

