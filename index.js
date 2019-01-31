var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var inquirer = require('inquirer');
var Preferences = require('preferences');
var GitHubApi = require('github');
var fs = require('fs');
var Twit = require('twit')
var prompt = require('prompt');
var DONOT = require('./config.json')
const Discord = require('discord.js');
const bot = new Discord.Client();

function start() {
    // Events
    var T = new Twit({
        consumer_key: DONOT.consumerKey,
        consumer_secret: DONOT.consumerSecret,
        access_token: DONOT.accessToken,
        access_token_secret: DONOT.accessTokenSecret,
        timeout_ms: 60 * 1000,
    })
    var stream = T.stream('statuses/filter', {
        track: phrase
    })
    stream.on('tweet', function(tweet) {
        chalk.blue.bold(tweet.text)
    })
    var questions = [{
        type: 'list',
        name: 'twitterOrDiscord',
        message: 'Twitter or Discord bot?',
        choices: ['Twitter', 'Discord'],
        filter: function(val) {
            return val.toLowerCase();
        }
    }];

}

clear();
console.log(
    chalk.cyan(
        figlet.textSync('Twitter \n      Bot', {
            horizontalLayout: 'full'
        })
    )
);

getTwitterToken()

function loop() {
    try {
        var T = new Twit({
            consumer_key: DONOT.consumerKey,
            consumer_secret: DONOT.consumerSecret,
            access_token: DONOT.accessToken,
            access_token_secret: DONOT.accessTokenSecret,
            timeout_ms: 60 * 1000,
        })
    } catch (err) {
        console.log(err)
        return;
    }
    prompt.get(['What would you like to do?'], function(err, result) {
        if (result['What would you like to do?'].toLowerCase() === "tweet") {
            prompt.get(['What would you like to tweet?'], function(err, result) {
                T.post('statuses/update', {
                    status: result['What would you like to tweet?']
                }, function(err, data, response) {
                    console.log(chalk.bgBlue('The tweet has been posted!'))
                    loop()
                })
            })
        } else if (result['What would you like to do?'].toLowerCase() === "keyword") {
            prompt.get(['What keyword do you want me to search for?'], function(err, result) {
                T.get('search/tweets', {
                    q: result['What keyword do you want me to search for?'],
                    count: 1
                }, function(err, data, response) {
                    try {
                        console.log(chalk.red("Top result: \n") + chalk.magenta(JSON.stringify(data.statuses[0].text)) + chalk.green("\n By " + JSON.stringify(data.statuses[0].user.screen_name)))
                        loop()
                    } catch (err) {
                        console.log(chalk.red.bold.underline('No data found. Make sure you spelt it correctly.'))
                        loop()
                    }
                })
            })
        } else if (result['What would you like to do?'].toLowerCase() === "quit") {
            process.exit()
        } else if (result['What would you like to do?'].toLowerCase() === "back") {
            clear();
            console.log(
                chalk.cyan(
                    figlet.textSync('Twitter \n      Bot', {
                        horizontalLayout: 'full'
                    })
                )
            );
            start()
        } else {
            console.log(chalk.red.bold.underline('Invalid command, make sure you typed it correctly. If you have that command hasn\'t been added yet.'))
            loop()
        }
    });
}

function discord() {

    var T = new Twit({
        consumer_key: DONOT.consumerKey,
        consumer_secret: DONOT.consumerSecret,
        access_token: DONOT.accessToken,
        access_token_secret: DONOT.accessTokenSecret,
        timeout_ms: 60 * 1000,
    })

    clear();
    console.log(
        chalk.cyan(
            figlet.textSync('        BOT \n RUNNING', {
                horizontalLayout: 'full'
            })
        )
    )
    console.log(
        chalk.cyan(
            'Make sure you put in your ID under adminID in the DONOTGIVEAWAY file and any potential admins by inserting a comma after the first ID under adminID'
        )
    )
    bot.on("message", function(msg) {

        var input = msg.content.toLowerCase();

        var want = msg.content.split(" ")[1];

        if (input.startsWith(DONOT.prefix + "tweet ")) {
            DONOT.adminID.forEach(function(element) {
                if (element === msg.author.id) {
                    T.post('statuses/update', {
                        status: want
                    }, function(err, data, response) {
                        msg.channel.send('*Tweet has been posted!*')
                    })
                }
            });

        }
        if (input.startsWith(DONOT.prefix + "keyword ")) {
            T.get('search/tweets', {
                q: want,
                count: 1
            }, function(err, data, response) {
                try {
                    // JSON.stringify(data.statuses[0].text) - result
                    // JSON.stringify(data.statuses[0].user.screen_name) - author
                    var str = JSON.stringify(data.statuses[0].id_str)
                    str = str.slice(0, -1).slice(1)
                    var iwish = JSON.stringify(data.statuses[0].user.profile_image_url)
                    iwish = iwish.slice(0, -1).slice(1)
                    console.log(iwish)
                    const embed = new Discord.RichEmbed()
                        .setTitle('Tweet URL')
                        .setAuthor('Search results:')
                        .setColor(0x00AE86)
                        .setFooter('Twitter bot | Tweet sent ' + JSON.stringify(data.statuses[0].created_at), bot.user.avatarURL)
                        .setThumbnail(iwish)
                        .setURL('https://twitter.com/xd/status/' + str)
                        .addField('Tweet', JSON.stringify(data.statuses[0].text))
                        .addField('Author', JSON.stringify(data.statuses[0].user.screen_name))

                    msg.channel.send(
                        embed,
                        '', {
                            disableEveryone: true
                        }
                    );
                } catch (err) {
                    console.log(err)
                }
            })
        }
    });
}

function getTwitterToken(callback) {
    var questions = [{
        name: 'quickQuestion',
        type: 'confirm',
        message: 'Have you wrote all your tokens in the DONOTGIVEAWAY.json file yet? \n If not then go ahead and do that now. ',
        default: true
    }];
    //Application login OAuth for Twitter
    inquirer.prompt(questions).then(function(answers) {
        if (answers.quickQuestion === true) {
            start()
        } else {
            console.log(chalk.red('Look up videos on youtube about how to get your twitter and Discord tokens and put it in DONTGIVEAWAY.json'))
            process.exit()
        }
    })
}

function start() {
    var questions = [{
        type: 'list',
        name: 'twitterOrDiscord',
        message: 'Twitter or Discord bot?',
        choices: ['Twitter', 'Discord'],
        filter: function(val) {
            return val.toLowerCase();
        }
    }];

    inquirer.prompt(questions).then(function(answers) {
        var answer = answers["twitterOrDiscord"]
        console.log(chalk.magenta('\nYou have chosen:'));
        console.log(chalk.yellow(answer));
        if (answer === "discord") {
            discord()
        } else {
            loop()
        }
    });
}
bot.login(DONOT.discordBotToken)
