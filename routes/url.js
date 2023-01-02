const {
  createUrl,
  checkIfUrlIsValid,
  checkIfUrlIsUnique,
  checkIfUrlHasProtocol,
} = require("../config/helperFunctions");
const Url = require("../models/UrlModel");

express = require("express");
const router = express.Router();

router.post("/url", async (req, res) => {
  const { url } = req.body;
  const isValidUrl = checkIfUrlIsValid(url);
  const hasProtocall = checkIfUrlHasProtocol(url);

  // check if the url is valid
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

    // append protocall if needed
    const originalUrl = hasProtocall ? req.body.url : `https://${req.body.url}`;

    //  create instance
    const newItem = new Url({ url: originalUrl, short: url });

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

router.get("/:url", async (req, res) => {
  const url = await Url.findOne({ short: req.params.url });

  if (url) {
    url.clicks.push({
      date: Date.now(),
    });

    await url.save();

    return res.status(301).redirect(url.url);
  }

  return res.status(400).json({ foo: "no url found" });
});

module.exports = router;
