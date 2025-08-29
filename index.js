const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//  Custom JSON error handler
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        throw new Error("Invalid JSON format");
      }
    },
  })
);

// Error-handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err.message === "Invalid JSON format") {
    return res.status(400).json({
      is_success: false,
      user_id: "teja_gopal_01012001",
      email: "youremail@example.com",
      roll_number: "ABCD123",
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      message: "Invalid JSON: Please check request body format",
    });
  }
  next(err);
});

// My details
const FULL_NAME = process.env.FULL_NAME || "Somu_Teja_Gopal";
const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "13082005";
const EMAIL = process.env.EMAIL || "tejagopal33@example.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "22BIT0339";

// Helper: alternating caps reverse
function alternatingCapsReverse(lettersOnly) {
  let reversed = lettersOnly.split("").reverse();
  return reversed
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.post("/bfhl", (req, res) => {
  try {
    // Step 1: Missing "data"
    if (!req.body || req.body.data === undefined) {
      return res.status(400).json({
        is_success: false,
        user_id: `${FULL_NAME.toLowerCase()}_${DOB_DDMMYYYY}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        message: "Missing input: 'data' field is required",
      });
    }

    // Step 2: Data exists but not an array
    if (!Array.isArray(req.body.data)) {
      return res.status(400).json({
        is_success: false,
        user_id: `${FULL_NAME.toLowerCase()}_${DOB_DDMMYYYY}`,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        message: "Invalid input: 'data' must be an array",
      });
    }

    const data = req.body.data || [];
    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = BigInt(0);
    let lettersOnly = "";

    for (let token of data) {
      if (typeof token !== "string") {
        return res.status(400).json({
          is_success: false,
          user_id: `${FULL_NAME.toLowerCase()}_${DOB_DDMMYYYY}`,
          email: EMAIL,
          roll_number: ROLL_NUMBER,
          odd_numbers: [],
          even_numbers: [],
          alphabets: [],
          special_characters: [],
          sum: "0",
          concat_string: "",
          message: "All elements in 'data' must be strings",
        });
      }

      if (/^[A-Za-z]+$/.test(token)) {
        alphabets.push(token.toUpperCase());
        lettersOnly += token;
      } else if (/^-?\d+$/.test(token)) {
        const num = BigInt(token);
        sum += num;
        if (num % 2n === 0n) evenNumbers.push(token);
        else oddNumbers.push(token);
      } else {
        specialCharacters.push(token);
        lettersOnly += token.replace(/[^A-Za-z]/g, "");
      }
    }

    
    return res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME.toLowerCase()}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: oddNumbers,
      even_numbers: evenNumbers,
      alphabets: alphabets,
      special_characters: specialCharacters,
      sum: sum.toString(),
      concat_string: alternatingCapsReverse(lettersOnly),
    });
  } catch (err) {
    return res.status(400).json({
      is_success: false,
      user_id: `${FULL_NAME.toLowerCase()}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      message: "Failed to process: " + err.message,
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
