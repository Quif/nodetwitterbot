var chalk       = require('./node_modules/chalk');
var clear       = require('./node_modules/clear');
var CLI         = require('./node_modules/clui');
var figlet      = require('./node_modules/figlet');
var inquirer    = require('./node_modules/inquirer');
var Preferences = require('./node_modules/preferences');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('./node_modules/github');
var fs          = require('fs');
var Twit = require('./node_modules/twit')
var prompt = require('prompt');
var DONOTGIVEAWAY = fs.readFileSync('./DONOTGIVEAWAY.json')
var DONOT = JSON.parse(DONOTGIVEAWAY)

function start(){
var questions = [
  {
    type: 'list',
    name: 'twitterOrDiscord',
    message: 'Twitter or Discord bot?',
    choices: ['Twitter', 'Discord'],
    filter: function (val) {
      return val.toLowerCase();
    }
  }
];

inquirer.prompt(questions).then(function (answers) {
  var answer = answers["twitterOrDiscord"]
  console.log(chalk.magenta('\nYou have chosen:'));
  console.log(chalk.yellow(answer));
    if(answer=== "discord"){
        console.log(chalk.red('Sorry but i havent added the discord feature yet.'))
    }else{
      getTwitterToken()
    }
});
}

clear();
console.log(
  chalk.cyan(
    figlet.textSync('Twitter \n      Bot', { horizontalLayout: 'full' })
  )
);

getTwitterToken()

function loop(){
            try{
      var T = new Twit({
        consumer_key:         DONOT.consumerKey,
        consumer_secret:      DONOT.consumerSecret,
        access_token:         DONOT.accessToken,
        access_token_secret:  DONOT.accessTokenSecret,
        timeout_ms:           60*1000,
      })
          } catch(err) {
            console.log(err)
            return;
          }
    prompt.get(['What would you like to do?'], function (err, result) {
      if(result['What would you like to do?'].toLowerCase() === "tweet"){
        prompt.get(['What would you like to tweet?'], function (err, result) {
          T.post('statuses/update', { status: result['What would you like to tweet?'] }, function(err, data, response) {
            console.log(chalk.bgBlue('The tweet has been posted!'))
            loop()
          })
        })
      } else if(result['What would you like to do?'].toLowerCase() === "keyword") {
        prompt.get(['What keyword do you want me to search for?'], function (err, result) {
          T.get('search/tweets', { q: result['What keyword do you want me to search for?'] + ' :2017-07-6', count: 3 }, function(err, data, response) {
            try{
            console.log(chalk.red("Top result: \n") + chalk.magenta(JSON.stringify(data.statuses[1].text)) + chalk.green("\n By " + JSON.stringify(data.statuses[1].user.screen_name)))
            loop()
            } catch(err) {
              console.log(chalk.red.bold.underline('No data found. Make sure you spelt it correctly.'))
              loop()
            }
          })
        })
      } else if(result['What would you like to do?'].toLowerCase() === "quit"){
        process.exit()
      } else if(result['What would you like to do?'].toLowerCase() === "back"){
        clear();
console.log(
  chalk.cyan(
    figlet.textSync('Twitter \n      Bot', { horizontalLayout: 'full' })
  )
);
        start()
      } else {
        console.log(chalk.red.bold.underline('Invalid command, make sure you typed it correctly. If you have that command hasn\'t been added yet.'))
        loop()
      } 
  });
}

function getTwitterToken(callback) {
  var questions = [
    {
      name: 'quickQuestion',
      type: 'confirm',
      message: 'Have you wrote all your tokens in the DONOTGIVEAWAY.json file yet? \n If not then go ahead and do that now. ',
      default: true
      }
  ];
        //Application login OAuth for Twitter
  inquirer.prompt(questions).then(function (answers) {
        if(answers.quickQuestion === true){
      start()
    } else {
      console.log(chalk.red('Look up videos on youtube about how to get your twitter tokens and put it in DONTGIVEAWAY.json'))
      process.exit()
    }
  })
}

function start(){
var questions = [
  {
    type: 'list',
    name: 'twitterOrDiscord',
    message: 'Twitter or Discord bot?',
    choices: ['Twitter', 'Discord'],
    filter: function (val) {
      return val.toLowerCase();
    }
  }
];

inquirer.prompt(questions).then(function (answers) {
  var answer = answers["twitterOrDiscord"]
  console.log(chalk.magenta('\nYou have chosen:'));
  console.log(chalk.yellow(answer));
    if(answer=== "discord"){
        console.log(chalk.red('Sorry but i havent added the discord feature yet.'))
    }else{
      loop()
    }
});
}