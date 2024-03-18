const express = require("express");
const bodyParser = require("body-parser");
const { initializeApp } = require("firebase/app");
const { getAuth, sendPasswordResetEmail } = require("firebase/auth");
const { getDatabase, ref, set, push } = require("firebase/database");
const app = express();
const port = 3000;
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6_Fls-zrOp1JTSvEFPNkVUf7iOeg7TXU",
  authDomain: "waterlevel-c2a1b.firebaseapp.com",
  databaseURL: "https://waterlevel-c2a1b-default-rtdb.firebaseio.com",
  projectId: "waterlevel-c2a1b",
  storageBucket: "waterlevel-c2a1b.appspot.com",
  messagingSenderId: "940376979833",
  appId: "1:940376979833:web:4622066a99cbfe86ee97a8",
  measurementId: "G-NL86V4999M"
};
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const database = getDatabase(firebaseApp);

// Serve static files
app.use(express.static("public"));

// Set EJS as the view engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const userRef = ref(database, "users/" + email.replace(".", ","));
  set(userRef, {
    email: email,
    password: password,
  });
  console.log(userRef);
  res.redirect("/home");
});

// Render login page
app.get("/", (req, res) => {
  res.render("login");
});


app.get("/forgot-password", (req, res) => {
  res.render("forgotPass");
});
// Handle forgot password request
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
console.log(email)
  sendPasswordResetEmail(auth, email)
    .then(() => {
      res.send("Password reset email sent. Check your inbox.");
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
      res.status(500).send("Error sending password reset email.");
    });
});

// Render forgot password page


// Admin SDK API to generate the password reset link.
// const userEmail =req.body.email;
// getAuth()
//   .generatePasswordResetLink(userEmail, actionCodeSettings)
//   .then((link) => {
//     // Construct password reset email template, embed the link and send
//     // using custom SMTP server.
//     return sendCustomPasswordResetEmail(userEmail, displayName, link);
//   })
//   .catch((error) => {
//     // Some error occurred.
//   });













// const generateRandomWaterLevel = () => Math.round(Math.random() * 20 + 80);
// const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const saveRandomValueToDatabase = async (
//   villageName,
//   monthKey,
//   dayKey,
//   hour,
//   minute
// ) => {
//   const timeKey = `${hour.toString().padStart(2, "0")}:${minute
//     .toString()
//     .padStart(2, "0")}`;
//   const randomValue = generateRandomWaterLevel();

//   // Save the value to the database under the specified village, month, day, hour, and minute
//   try {
//     const userRef = ref(
//       database,
//       `users/${villageName}/${monthKey}/${dayKey}/${timeKey}`
//     );
//     await set(userRef, randomValue);
//     console.log(
//       `${villageName}/${monthKey}/${dayKey}/${timeKey}:`,
//       randomValue,
//       "Value added to the database"
//     );
//   } catch (error) {
//     console.log("Error saving value to the database:", error);
//   }
// };

// app.get("/village", async (req, res) => {
//   const villageName = "village2"; // Replace with the actual village name

//   for (let month = 1; month <= 12; month++) {
//     const monthKey = `month${month}`;

//     for (let day = 1; day <= 30; day++) {
//       const dayKey = `day${day}`;

//       for (let hour = 0; hour < 24; hour++) {
//         for (let minute = 0; minute < 60; minute += 10) {
//           await saveRandomValueToDatabase(
//             villageName,
//             monthKey,
//             dayKey,
//             hour,
//             minute
//           );
//           await wait(1); // Adjust the wait time here (in milliseconds)
//         }
//       }
//     }
//   }

//   res.send("Values added to the database.");
// });

// app.get("/home", (req, res) => {
//   const villages = [
//     { name: "Village 1", waterLevel: 85 },
//     { name: "Village 2", waterLevel: 90 },
//     // Add more villages as needed
//   ];
//   res.render("home", { villages: villages });

//   // res.render('home');
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
