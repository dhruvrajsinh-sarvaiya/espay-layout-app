const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const users = require("./controller/api/users/index");
const profile = require("./controller/api/profile");
const posts = require("./controller/api/posts");
const public = require("./controller/public");
//Added By Kushal
const pages = require("./controller/api/private/v1/pages");
const sitesetting = require("./controller/api/private/v1/sitesetting");
const languages = require("./controller/api/private/v1/languages");
const news = require("./controller/api/private/v1/news");
const faqcategories = require("./controller/api/private/v1/faqcategory");
const faqquestions = require("./controller/api/private/v1/faqquestion");
const cmsdashboard = require("./controller/api/private/v1/cmsdashboard");
//Added By Kushal
//Added by Jayesh 04-2018 for get/set city,country,state,contactus,surveys - start
const country = require("./controller/api/private/v1/localization/country/index");
const state = require("./controller/api/private/v1/localization/state/index");
const city = require("./controller/api/private/v1/localization/city/index");
const contactus = require("./controller/api/private/v1/contactus/index");
const surveys = require("./controller/api/private/v1/surveys/index");
const zohocrm = require("./controller/api/private/v1/zohocrm/index");
const subscribe = require('./controller/api/private/v1/subscribe');
const regions = require("./controller/api/private/v1/regions");
const helpmanualmodules = require("./controller/api/private/v1/helpmanualmodule");
const helpmanuals = require("./controller/api/private/v1/helpmanual");
const coinListRequest = require("./controller/api/private/v1/coinListRequest"); //Added by dhara gajera 3/1/2018
//Ended by Jayesh 04-2018 for get/set city,country,state,contactus,surveys - end
const socialMedia = require("./controller/api/private/v1/socialMedia"); // Added By Megha Kariya (13/02/2019)

const helmet = require('helmet'); // Added by Bharat Jograna dt:13/06/2019
const app = express();

// Added by Bharat Jograna dt:13/06/2019
// Helmet use for header... 
app.use(helmet());

// For setting white listed Content
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    upgradeInsecureRequests: false,
    fontSrc: ["'self'"],
    imgSrc: ["'self'"],
    mediaSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'"],
  }
}));

// For handling Adobe products' crossdomain requests
app.use(helmet.permittedCrossDomainPolicies({
  permittedPolicies: 'all'
}));

// don't alow browser DNS prefetching
app.use(helmet.dnsPrefetchControl({ allow: false }));

// For handling Certificate Transparency
app.use(helmet.expectCt({
  enforce: true,
  maxAge: 30,
}));

// to limit your site's features
app.use(helmet.featurePolicy({
  features: {
    fullscreen: ["'self'"],
    vibrate: ["'none'"],
    syncXhr: ["'none'"],
    geolocation: ["'self'"],
  }
}));

// to deny clickjacking
app.use(helmet.frameguard({ action: 'deny' }));

// to remove the X-Powered-By header
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

// For HTTP Public Key Pinning for next 90 days
const hpkp = require('hpkp');
app.use(hpkp({
  maxAge: 7776000,
  includeSubdomains: false,
  sha256s: ['CfDJBE84Y=', 'Zs8SJNtGO=']
}));

// For HTTP Strict Transport Security for next 90 days
app.use(helmet.hsts({
  maxAge: 7776000,
  includeSubDomains: false,
  preload: true
}));

// sets X-Download-Options 
app.use(helmet.ieNoOpen());

// to disable client-side caching
app.use(helmet.noCache());

// to keep clients from sniffing the MIME type
app.use(helmet.noSniff());

// to hide the Referer header
app.use(helmet.referrerPolicy({
  policy: ["same-origin"]
}));

// adds some XSS protections
app.use(helmet.xssFilter({
  xssFilter: true,
}));
//End Bharat Jograna code....

// Added by salim dt:11/06/2019
// Limited access for api request...
const rateLimit = require("express-rate-limit");
var MongoStore = require('rate-limit-mongo');

var contactLimiter = new rateLimit({
  store: new MongoStore({
    uri: 'mongodb://172.20.65.116/mernStack',
    collectionName: 'mernStack'
  }),
  max: 2,
  windowMs: 5 * 60 * 1000, // 5 minutes
  message: "Too many attempt. Wait sometime and after you will try."
});
//End salim

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { autoIndex: false, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

require("./config/passport")(passport);

app.all("/*", function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // Set custom headers for CORS
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key, authorization"
  );

  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    if (req.url === "/public/generateToken") {
      next();
    } else {
      if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ").length > 1 &&
        req.headers.authorization.split(" ")[0] == "JWT"
      ) {
        next();
      } else {
        res.status(401);
        res.json({
          status: 401,
          message: "Invalid Token"
        });
        res.end();
      }
    }
  }
});

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/public", public);

// Added By Kushal
app.use("/api/private/v1/pages", pages);
app.use("/api/private/v1/sitesetting", sitesetting);
app.use("/api/private/v1/languages", languages);
// app.use("/api/private/v1/news", news);
app.use("/api/private/v1/news", news);
app.use("/api/private/v1/faqcategory", faqcategories);
app.use("/api/private/v1/faqquestion", faqquestions);
app.use("/api/private/v1/cmsdashboard", cmsdashboard);
app.use('/api/private/v1/subscribe', subscribe);
app.use("/api/private/v1/regions", regions);
//Added by Jayesh 04-2018 for get/set city,country,state,contactus,surveys - start
app.use("/api/private/v1/localization/country", country);
app.use("/api/private/v1/localization/state", state);
app.use("/api/private/v1/localization/city", city);
app.use("/api/private/v1/contactus", contactLimiter, contactus);
app.use("/api/private/v1/surveys", surveys);
app.use("/api/private/v1/zohocrm", zohocrm);
//Added by Jayesh 04-2018 for get/set city,country,state,contactus,surveys - end
//Added by Kushal 10-01-2019
app.use("/api/private/v1/helpmanualmodule", helpmanualmodules);
app.use("/api/private/v1/helpmanual", helpmanuals);
app.use("/api/private/v1/coinListRequest", coinListRequest); //Added by dhara gajera 3/1/2019
app.use("/api/private/v1/socialMedia", socialMedia); // Added By Megha Kariya (13/02/2019)
// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 7000;

app.listen(port, () => console.log(`Server running on port ${port}`));
