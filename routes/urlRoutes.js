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

    // check if the url is valid
    const isValidUrl = checkIfUrlIsValid(url);
    if (!isValidUrl) return res.status(400).json({ err_msg: "invalid url" });

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
      const hasProtocall = checkIfUrlHasProtocol(url);
      const originalUrl = hasProtocall
        ? req.body.url
        : `https://${req.body.url}`;

      // get title from url
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
      return res.status(400).json({ err_msg: "error", err });
    }
  }
);

// ##### GET URL ######
router.get("/:url", async (req, res) => {
  // get url data in database
  const url = await Url.findOne({ short: req.params.url });

  // register click
  if (url) {
    url.clicks.push({
      date: Date.now(),
    });

    await url.save();

    //  redirect user to original url
    return res.status(301).redirect(url.url);
  }

  return res.status(400).json({ err_msg: "no url found" });
});

// ##### GET USER DATA ######
router.get(
  "/api/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // get all urls from user
      const urls = await Url.find({ owner: req.user._id });
      return res.json({ success: true, response: urls });
    } catch (err) {
      return res.status(400).json({ err_msg: "no data found" });
    }
  }
);

// ##### DELETE URL ######
router.delete(
  "/api/url/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Url.deleteOne({
        _id: req.params.id,
        owner: req.user._id,
      });

      return res.json({ success: true });
    } catch (err) {
      return res.status(400).json({ foo: "no url found" });
    }
  }
);

module.exports = router;
