const chalk = require("chalk");
const moment = require("moment");
const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json");
const Apex = require('dark.db'); // creating database
const db = new Apex({
  file: 'database.json',
  readable: 'true',
  language: 'EN'
}); 

module.exports = client => {
  console.log(
    `[${moment().format("YYYY-MM-DD HH:mm:ss")}] BOT: Aktif, Komutlar Yüklendi!`
  );
  console.log(
    `[${moment().format("YYYY-MM-DD HH:mm:ss")}] BOT: ${
      client.user.username
    } İsmi ile Sisteme Giriş Yapıldı!`
  );
  client.user.setStatus("idle");
  client.user.setActivity("p!yardım");


};
