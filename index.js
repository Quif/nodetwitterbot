var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('github');
var fs          = require('fs');

clear();
console.log(
  chalk.cyan(
    figlet.textSync('Twitter \n      Bot', { horizontalLayout: 'full' })
  )
);

function getTwitterToken(callback) {
  var questions = [
    {
      name: 'token',
      type: 'password',
      message: 'Enter your Twitter token: ',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your token';
        }
      }
    }
  ];

    return callback()
    
  inquirer.prompt(questions).then(callback);
}

var questions = [
  {
    type: 'list',
    name: 'userOrToken',
    message: 'Are you going to use a user bot or app?',
    choices: ['User Bot', 'Application'],
    filter: function (val) {
      return val.toLowerCase();
    }
  }
];

inquirer.prompt(questions).then(function (answers) {
  var answer = answers["userOrToken"]
  console.log(chalk.magenta('\nYou have chosen:'));
  console.log(chalk.yellow(answer));
    if(answer === "User Bot"){
        
    }else{
       getTwitterToken(function(){
        console.log(JSON.stringify(arguments));
       }); 
    }
});