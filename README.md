# Client-side usage (PORT : 3000)

## ENV Variables

Make Sure to Create a .env file in root directory and add appropriate variables in order to use the app.

**Essential Variables**

- REACT_APP_CLOUDINARY_CLOUD_NAME= "****"         // cloud name to save image in cloudinary
- REACT_APP_BACKEND_URL= "http://localhost:8080"         // Backend url related to frontend , Default run on (http://localhost:8080) 

_fill each filed with your info respectively_

### Start

```terminal
$ cd client          // Go to frontend folder
$ yarn # or npm install    // Install packages
$ npm start        // Run it locally
$ npm run build       // this will build the frontend code to es5 js codes and generate a build folder
```

# Server-side usage (PORT : 8080)

## ENV Variables

Make Sure to Create a .env file in root directory and add appropriate variables in order to use the app.

**Essential Variables**

- FRONTEND_URL = " "         // Frontend url related to Backend.
- JWT_SECRET_KEY = " "         // Secure secret key for JSON Web Tokens.
- MONGODB_URL = " "         // MongoDB connection URL for database access.
- PORT = "8080"         // Port to run backend, Default : 8080
- FRONTEND_URL_ARRAY= ["http://localhost:3000"]         // Frontend url add in backend , Default run on ["http://localhost:3000"]

_fill each filed with your info respectively_

### Start

```terminal
$ cd server       // Go to backend folder
$ yarn # or npm install       // Install packages
$ npm run dev       // run it locally
$ npm run build       // this will build the frontend code to es5 js codes and generate a dist file
```
