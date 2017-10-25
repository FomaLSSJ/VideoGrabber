const TeleBot = require('telebot'),
    platforms = require('../platforms'),
    queue = require('../queue'),
    bot = new TeleBot({ token: process.env.TELEGRAM_TOKEN });

const API = 'https://thecatapi.com/api/images/get?format=src&type=';

const replyMarkup = bot.keyboard([
    ['/kitty', '/kittygif']
], {resize: true, once: false});

bot.on('text', msg => {
    console.log(`[text] ${ msg.chat.id } ${ msg.text }`);
});

bot.on(['/start', '/help'], msg => {
    return bot.sendMessage(msg.chat.id,
        '😺 Use commands: /kitty, /kittygif and /about', {replyMarkup}
    );
});

bot.on('/about', msg => {
    let text = '😽 This bot is powered by TeleBot library ' +
        'https://github.com/kosmodrey/telebot Go check the source code!';

    return bot.sendMessage(msg.chat.id, text);
});

bot.on(['/kitty', '/kittygif'], msg => {
    let promise;
    let id = msg.chat.id;
    let cmd = msg.text.split(' ')[0];

    if (cmd == '/kitty') {
        promise = bot.sendPhoto(id, API + 'jpg', {
            fileName: 'kitty.jpg',
            serverDownload: true
        });
    } else {
        promise = bot.sendDocument(id, API + 'gif#', {
            fileName: 'kitty.gif',
            serverDownload: true
        });
    }

    bot.sendAction(id, 'upload_photo');

    return promise.catch(error => {
        console.log('[error]', error);
        bot.sendMessage(id, `😿 An error ${ error.error_code } occurred, try again.`);
    });
});

bot.on('/xvideos', msg => {
    let url = msg.text.split(' ').pop();

    if (!url.match(/(https?):\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
        console.log('Error regexp');
        return bot.sendMessage(msg.chat.id, 'Sorry, I can not download this video');
    }

    return platforms.xvideos.getDetails(url)
        .then(details => queue.create(details))
        .then(result => bot.sendMessage(msg.chat.id, 'Yup, I add download in queue!'))
        .catch(err => {
            console.log(err);
            return bot.sendMessage(msg.chat.id, 'Sorry, I can not download this video')
        });
});

bot.on('/eroprofile', msg => {
    let url = msg.text.split(' ').pop();

    if (!url.match(/(https?):\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
        return bot.sendMessage(msg.chat.id, 'Sorry, I can not download this video');
    }

    return platforms.eroprofile.getDetails(url)
        .then(details => queue.create(details))
        .then(result => bot.sendMessage(msg.chat.id, 'Yup, I add download in queue!'))
        .catch(err => bot.sendMessage(msg.chat.id, 'Sorry, I can not download this video'));
});

module.exports = {
    init: () => {
        return bot.start();
    }
};