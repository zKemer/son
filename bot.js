const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const db = require("wio.db");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const fs = require('fs');
const http = require("http");
const express = require("express");
require("./util/eventLoader.js")(client);
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
client.queue = new Map();
const OpusScript = require('opusscript');
//------------------Loga Mesaj Atma------------------\\

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

//----------------Komut Algılayıcısı----------------\\

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  
  //----------------Komut Algılayıcısı----------------\\

  //---------------Perms Yerleştirmeleri--------------\\
  
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if ((message.author.id === ayarlar.sahip)) permlvl = 4;
  return permlvl;
};

//---------------Perms Yerleştirmeleri--------------\\

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});
client.login(ayarlar.token);

client.on("guildMemberRemove", async member => {
  let sayac = db.fetch(`sayaj_${member.guild.id}`)

  if (!sayac) {
    return;
    }

let giriscikis = db.fetch(`sayaj_sayısı_${member.guild.id}`)
let embed = new Discord.MessageEmbed()
.setTitle(member.guild.name)
.setDescription(`📥 ${member.user.tag}, aramızdan ayrıldı. **${giriscikis}** kişi olmamıza **${giriscikis - member.guild.memberCount}** kişi kaldı!` )
.setColor("RED")
.setFooter("", client.user.avatarURL);

try {
member.guild.channels.cache.get(sayac).send(embed)

} catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
  return console.log(e)
}
})



client.on("guildMemberAdd", async member => {
  let sayac = db.fetch(`sayaj_${member.guild.id}`)

  if (!sayac) {
    return;
    }

let giriscikis = db.fetch(`sayaj_sayısı_${member.guild.id}`)
let embed = new Discord.MessageEmbed()
.setTitle(member.guild.name)
.setDescription(`📥 ${member.user.tag}, aramıza katıldı **${giriscikis}** kişi olmamıza **${giriscikis - member.guild.memberCount}** kişi kaldı!` )
.setColor("GREEN")
.setFooter("", client.user.avatarURL);

let yapımcı = new Discord.MessageEmbed()
.setTitle(member.user.tag)
.setDescription(`Çok sevdiğim bir insan ve aynı zamanda yapımcım olan ${member.user.tag} sunucuya katıldı. ` )
.setColor("GREEN")
.setFooter("", client.user.avatarURL);


if(member.id == "785765015487381525") return member.guild.channels.cache.get(sayac).send(yapımcı)

try {
member.guild.channels.cache.get(sayac).send(embed)
} catch (e) { // eğer hata olursa bu hatayı öğrenmek için hatayı konsola gönderelim.
  return console.log(e)
}
})
