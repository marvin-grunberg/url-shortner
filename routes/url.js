const {
  createUrl,
  checkIfUrlIsValid,
  checkIfUrlIsUnique,
} = require("../config/helperFunctions");
const Url = require("../models/UrlModel");

express = require("express");
const router = express.Router();

router.post("/url", async (req, res) => {
  const { url } = req.body;
  const isValidUrl = checkIfUrlIsValid(url);

  if (!isValidUrl) return res.status(400).json({ foo: "invalid url" });

  try {
    // create unique url
    let url;
    url = createUrl(7);

    // check if url is unique
    isUnique = (await checkIfUrlIsUnique(url)) === null;

    // is url is not unique generate new url and check is new url is unique
    do {
      url = createUrl(7);
      isUnique = (await checkIfUrlIsUnique(url)) === null;
    } while (isUnique === false);

    //  create instance
    const newItem = new Url({ url: req.body.url, short: url });

    //  save instance to databse
    const result = await newItem.save();

    return res.json({
      success: true,
      result: result,
    });
  } catch (err) {
    return res.status(400).json({ foo: "error", err });
  }
});

module.exports = router;
