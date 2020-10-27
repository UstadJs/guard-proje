const Discord = require("discord.js");
const db = require("quick.db");

exports.run = async function(client, message, args) {
  var kanal = message.mentions.channels.first()
  
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("**Hata!** `Yeterli yetkiye sahip değilsin. ` · `Gerekli Yetki: Mesajları Yönet (Manage Messages)`")

  if (!kanal) return message.channel.sendMessage("**Hata!** `Bir kanal belirtmelisin.`")
  db.set(`modlog_${message.guild.id}`, kanal)
  db.set(`modlogdurum_${message.guild.id}`, "aktif")
  const ayarlandi = new Discord.RichEmbed()
       .setColor("BLACK")
       .setTitle("Ayarlandı!")
       .setDescription("`Mod-Log kanalı,` **başarı ile** `ayarlandı.`")
       .setThumbnail(client.user.avatarURL)
       .setAuthor(message.author.username, message.author.avatarURL)
       .addField("`Mod-Log Kanalı`", `__***${kanal}***__`)
       .setFooter(`${client.user.username} · Mod-Log Kanalı Ayarlama Sistemi`)
  message.channel.sendEmbed(ayarlandi)
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['modlogayarla', 'modlog', 'mod-log'],
  permLevel: 2
};

exports.help = {
  name: 'mod-log-ayarla',
  description: 'Bot, mod-log kanalını ayarlar.',
  usage: 'mod-log-ayarla #kanal'
};