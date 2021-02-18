const Discord = require("discord.js");
const Apex = require('dark.db'); // creating database
const db = new Apex({
  file: 'database.json',
  readable: 'true',
  language: 'EN'
}); // languages: TR and EN
const ayarlar = require("../ayarlar.json");
exports.run = async (client, message, args) => {
    var permissionss = message.channel.permissionsFor(client.user);
    if (!permissionss.has('SEND_MESSAGES')) {
    
      
      return;
      
    }

    let prefix = await db.fetch(`prefix_${message.guild.id}`);
  if (prefix == null) prefix = ayarlar.prefix;

    let hesaplanma = db.fetch(`Pusula_değeri`)
    let pusula = db.fetch(`pusula_${message.author.id}`)
const embed = new Discord.MessageEmbed()
.setColor("#F0FFFF")
.setDescription(`Şu anda ${pusula} tane pusulanız var.
Pusula'nızın tanesini ${hesaplanma} TL'den satabilirsiniz. 
Güncel olarak **sesli kanalda** Pusula miktarı takip etmek isterseniz;
**${prefix}pusula-değeri kanal-kur** yazabilirsiniz.

`)
 if(!args[0] || !args[0] == "kanal-kur") return message.channel.send(embed)


  const emoved = new Discord.MessageEmbed()
.setColor("#F0FFFF")
.setDescription(`Artık Pusula değeri sesli kanalda gösterilecek.

`)
  if(args[0] == "kanal-kur") {

  
    var permissions = message.channel.permissionsFor(client.user);
    if (!permissions.has('MANAGE_CHANNELS')) {
    
      
      return message.channel.send("<:pusula_x:801061526463184897> Bu kanalı açmak için yeterli iznim yok.")
      
    }
  message.guild.channels.create(`Pusula Değeri • ${hesaplanma}`, {type : "voice"})
  


  return message.channel.send(emoved)}
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["değerler"],
  permLevel: 0
};

exports.help = {
  name: "pusula-değeri",
  description: "Yardım Menüsünü Gösterir.",
  usage: "yardım"
};
