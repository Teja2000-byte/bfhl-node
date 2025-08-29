const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Your details
const FULL_NAME = process.env.FULL_NAME || "teja_gopal";
const DOB_DDMMYYYY = process.env.DOB_DDMMYYYY || "01012001";
const EMAIL = process.env.EMAIL || "youremail@example.com";
const ROLL_NUMBER = process.env.ROLL_NUMBER || "ABCD123";

function alternatingCapsReverse(lettersOnly) {
  let reversed = lettersOnly.split("").reverse();
  return reversed
    .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
    .join("");
}

app.post("/bfhl", (req, res) => {
  try {
    const data = req.body.data || [];
    const oddNumbers = [];
    const evenNumbers = [];
    const alphabets = [];
    const specialCharacters = [];
    let sum = BigInt(0);
    let lettersOnly = "";

    data.forEach((token) => {
      if (/^[A-Za-z]+$/.test(token)) {
        alphabets.push(token.toUpperCase());
        lettersOnly += token.replace(/[^A-Za-z]/g, "");
      } else if (/^-?\d+$/.test(token)) {
        const num = BigInt(token);
        sum += num;
        if (num % 2n === 0n) evenNumbers.push(token);
        else oddNumbers.push(token);
      } else {
        specialCharacters.push(token);
        // also collect any letters inside special tokens
        lettersOnly += token.replace(/[^A-Za-z]/g, "");
      }
    });

    const response = {
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
    };

    res.json(response);
  } catch (err) {
    res.json({
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