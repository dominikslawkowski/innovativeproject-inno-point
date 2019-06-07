const request = require("request");
const githubCalls = require("../services/GitHubCalls");
const config = require("../config/index");
const TokenHandler = require("../services/TokenHandler");

const { getCode, getState, getToken } = require("../utils/selectors");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Models = require("../services/dbConnection");
const User = Models.User;
const ROLE = require("../utils/role");

const {
  client_id,
  client_secret,
  scope,
  allow_signup,
  github_url_authorize,
  github_url_token
} = config.github;

const { api, appUrl } = config;
const state = "randomState";

const github = new githubCalls();
const tokenHandler = new TokenHandler();

const gitHubRoutes = app => {
  app.get("/auth", (req, res) => {
    res.redirect(
      `${github_url_authorize}?client_id=${client_id}&scope=${scope}&allow_signup=${allow_signup}&state=${state}`
    );
  });

  app.get("/auth/callback", (req, res) => {
    const code = getCode(req.url);
    const req_state = getState(req.url);
    if (req_state !== state) {
      res.state = 500;
      res.redirect(`${api}/error`);
    } else {
      const github = new githubCalls();
      //generating user token with code from github
      github.gitPostGetUserToken(code).then(token => {
        //here should be all database operations
        //getting user information from github || user id , user name, user email, user avatar
        github.gitGetUserIdAndInfo(token).then(userData => {
          const {
            clientId,
            clientName,
            clientEmail,
            clientAvatar,
            bio,
            hireable,
            public_repos
          } = userData;

          let createdNewAccount = false;

          let generatedToken = tokenHandler.genToken();

          // jwt.sign({ id: clientId }, config.jwt.secretkey, (err, token) => {
          User.findAll({
            where: { id: clientId }
          })
            .then(result => {
              if (result.length === 0) {
                User.bulkCreate([
                  {
                    id: clientId,
                    name: clientName,
                    role: ROLE.DEVELOPER,
                    github_picture: clientAvatar,
                    email: clientEmail,
                    token: generatedToken
                  }
                ]);

                console.log("\x1b[32mNew account in database.\x1b[0m");
                createdNewAccount = true;
              } else {
                console.log("generated token " + generatedToken);
                User.update(
                  {
                    token: generatedToken
                  },
                  { where: { id: clientId } }
                );
                console.log("\x1b[33mJust an old user.\x1b[0m");
                createdNewAccount = false;
              }
            })
            .then(() => {
              if (createdNewAccount == true) {
                res.cookie("token", generatedToken);
                res.redirect(
                  `${appUrl}/first_login?&name=${userData.clientName}&email=${
                    userData.clientEmail
                  }&token=${token}`
                );
              } else {
                res.cookie("token", generatedToken);
                res.redirect(
                  `${appUrl}/dashboard/projects?token=${generatedToken}`
                );
              }
            })
            .catch(error => {
              console.log(error);
              res.redirect("/error");
            });
          //   });
        });
      });
    }
  });

  app.get("/", (req, res) => {});

  app.post("/github/createRepo", (req, res) => {
    const data = {
      title: req.body.title,
      description: req.body.description
    };
    github.gitPostCreateNewRepository(data).then(
      repoData => {
        res.send("repo created" + repoData);
      },
      reason => {
        res.state = 500;
        res.send("Error");
      }
    );
  });
};

module.exports = gitHubRoutes;
