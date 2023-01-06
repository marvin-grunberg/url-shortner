const passport = require("passport");
const {
  createUrl,
  checkIfUrlIsValid,
  checkIfUrlIsUnique,
  checkIfUrlHasProtocol,
} = require("../config/helperFunctions");
const Url = require("../models/UrlModel");
const axios = require("axios");
const cheerio = require("cheerio");
express = require("express");
const router = express.Router();

// ##### CREATE URL #####
router.post(
  "/url",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
      const originalUrl = hasProtocall
        ? req.body.url
        : `https://${req.body.url}`;

      // get html data
      const html = await axios(originalUrl);
      const $ = cheerio.load(html.data);

      const title =
        $('meta[property="og:title"]').attr("content") === undefined
          ? $("title").text()
          : $('meta[property="og:title"]').attr("content");

      //  create instance
      const newItem = new Url({
        url: originalUrl,
        short: url,
        owner: req.user._id,
        title: title === undefined ? originalUrl : title,
      });

      //  save instance to databse
      const result = await newItem.save();

      return res.json({
        success: true,
        result: result,
      });
    } catch (err) {
      return res.status(400).json({ foo: "error", err });
    }
  }
);

// ##### GET URL ######

router.get("/:url", async (req, res) => {
  const url = await Url.findOne({ short: req.params.url });

  console.log(req);

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
