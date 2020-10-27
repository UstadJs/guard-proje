const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const weather = require("weather-js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

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
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);
///////////////////////

client.on("guildMemberAdd", async member => {
  
   
    if(member.user.bot) {
     
      member.guild.roles.forEach(async function(yetkilirol){
  if(yetkilirol.id ==="655327985351524363")return
  if(yetkilirol.hasPermission("ADMINISTRATOR")){
       yetkilirol.setPermissions((yetkilirol.permissions-8))    
     }
      })
      let korumakanalı = client.channels.get("768137317294407692")
      if(!korumakanalı || korumakanalı === null){
        member.ban(member);
         member.guild.owner.send(`bot-log olmadığı içim sunucu sahibinin DM'sine yazıyorum.| **Sunucuya bir bot eklendi ve koruma nedeniyle botu banladım. \nBanlanan Bot: **${member}  `)
     }
      else{
        
      member.ban(member);
      korumakanalı.send(`** @here **Sunucuya Bilinmeyen Bir Bot Eklendi,Bilmiyorki Lidyalı'nın Bir Tanrı Olduğunu** \n**Banlanan Bot**: **${member}`)
     }
  }
    else{
      
    }
  
  })
//////////////////////////
client.on("roleUpdate", async function(oldRole, newRole) {
  
   const bilgilendir = await newRole.guild.fetchAuditLogs({type: "ROLE_UPLATE"}).then(hatırla => hatırla.entries.first())
    let yapanad= bilgilendir.executor;
  let idler= bilgilendir.executor.id;
  if(idler === "445684878298841099") return // yapan kişinin id si bu ise bir şey yapma
  if(oldRole.hasPermission("ADMINISTRATOR")) return
  
   setTimeout(() => {

     if(newRole.hasPermission("ADMINISTRATOR")){
   newRole.setPermissions((newRole.permissions-8))    
 }
     
 if(newRole.hasPermission("ADMINISTRATOR")){
  
     if(!client.guilds.get(newRole.guild.id).channels.has("683328036682203148")) return newRole.guild.owner.send(`**Bana Bağısladığı Üstün Güçlerle** ${yapanad} **Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün __Yönetici__ Yetkisini Aldım**. \n **Rol İsmi**: **${newRole.name}**`)//bu id ye sahip kanal yoksa sunucu sahibine yaz

  client.channels.get("767070111361400864").send(`@here **Ustad'ın Bana Bağısladığı Üstün Güçlerle** ${yapanad} **Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün __Yönetici__ Yetkisini Aldım**. \n **Rol İsmi**: **${newRole.name}**`)// belirtilen id ye sahip kanala yaz
 }
      }, 1000)
  })
///////////////////
client.on("channelDelete", async function(channel) {
if(channel.guild.id !== "767070111361400864") return;
    let logs = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'});
    if(logs.entries.first().executor.bot) return;
    channel.guild.member(logs.entries.first().executor).roles.filter(role => role.name !== "").array().forEach(role => {
              channel.guild.member(logs.entries.first().executor).removeRole(channel.guild.roles.get("765521727065030706"))
              channel.guild.member(logs.entries.first().executor).removeRole(channel.guild.roles.get("765521795058106418"))
              channel.guild.member(logs.entries.first().executor).removeRole(channel.guild.roles.get("765521403465170975"))

    })
const sChannel = channel.guild.channels.find(c=> c.id ==="767070111361400864")
const cıks = new Discord.RichEmbed()
.setColor('BLACK')
.setDescription(`${channel.name} adlı Kanal silindi Silen kişinin yetkilerini  çekiyorum`)
.setFooter('Narkotik')
sChannel.send(cıks)
  
channel.guild.owner.send(` **${channel.name}** adlı Kanal silindi Silen  kişinin yetkilerini aldım`)
}) 
////////////////////
client.login(ayarlar.token);



client.on('messageDelete', function(message) {
 const emoji = (client.emojis.find("name", "767828448256589834").toString())

    if(message.channel.type == 'text') {
        var log = message.guild.channels.find('name', "message-log");
        if (log !=655154357075181572)
            var embed = new Discord.RichEmbed()
        .setTitle(`Mesaj silindi. ${emoji}`)
        .setColor("#36393E")
        .setDescription(`<#${message.channel.id}> **kanalında** ` + message.author + ` **tarafından gönderilen bir mesaj silindi. \nSilinen Mesaj:** ` + message.cleanContent)
        .setFooter(`Silinen Mesaj ID: ${message.id} | Mesajı Silen Kullanıcı ID: ${message.author.id}`)
            log.sendMessage(embed);

    }

});

client.on('messageUpdate', function(oldMessage, newMessage) {

    if (newMessage.channel.type == 'text' && newMessage.cleanContent != oldMessage.cleanContent) {

        var log = newMessage.guild.channels.find('name', "systemm");
        if (log !=683327546854735993)
            
var embed = new Discord.RichEmbed()
          .setColor("#36393E")
          .setTitle('Mesaj Düzenlendi.')
          .setDescription(`<@${oldMessage.author.id}> **adlı kullanıcı** <#${oldMessage.channel.id}> **kanalına gönderdiği mesajı düzenledi.**`)
          .addField(`Eski Mesaj`, `${oldMessage.cleanContent}`)
          .addField(`Yeni Mesaj`, `${newMessage.cleanContent}`)
          
            log.sendMessage(embed);
    }

});
///////////////
client.on('roleCreate', async (role, member) => {

 let sChannel = role.guild.channels.find(c => c.name === 'rol-olusturma-log')

   
    

    sChannel.send(`**Koruma Sistemi**
Yeni Bir rol Eklendi ve Koruma Sebebiyle silindi
Silinen Rol: **${role.name}**
`)
    .then(() => console.log(`${role.name} adlı rol silindi`))
    .catch(console.error); 
role.delete()

});
////////////
////////////////////
////////////////sağ-tıkban koruma////////////////////////

client.on("guildBanAdd", async function(guild, user) {
  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());
  const yetkili = await guild.members.get(entry.executor.id);
setTimeout(async () =>{
    let logs = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'});
    if(logs.entries.first().executor.bot) return;
    
      guild.members.get(logs.entries.first().executor.id).removeRoles(guild.members.get(logs.entries.first().executor.id).roles) ///TÜM ROLLERİNİ ALIR
     setTimeout(()=>{ guild.members.get(logs.entries.first().executor.id).addRole("765532827542355980")/// VERİLECEK CEZALI ROL İD
    },3000)
const sChannel = guild.channels.find(c=> c.id ==="767068192827768852")
const cıks = new Discord.RichEmbed()
.setColor('BLACK')
.setDescription(`<@${yetkili.id}> ${user} adlı Kişiye Sağ tık ban Atıldığı için Banlayan Kişinin Yetkileri Alındı`)
.setFooter('Developer theandqa')
sChannel.send(cıks)
guild.owner.send(`' Nᴀʀᴋᴏᴛɪᴋ (-) | ** <@${yetkili.id}> İsimili Yetkili <@${user.id}>** Adlı Kişiyi Banladı Ve Yetkilerini Aldım.`)
},2000)
})
///////////////
/////////////////
// Metin Kanalı ya da Ses Kanalı Açıldığında
client.on("channelCreate", async (channel) => {
  // Eğer kanal silinirse üstteki kod devreye girer ve işlemleri başlatır
  // Rich Embed oluşturma
  const embedmemberadd23 = new Discord.RichEmbed()
  .setTitle(`-  #` + `${channel.name} adlı kanal silindiği için yetki rolleri çekildi.`, ``)
  .addField(`Hangi Yetkiye Sahip Roller Çekilir?`, `(Yönetici, Rolleri Yönet, Denetim Kaydını Görüntüle, Kanalları Yönet, Sunucuyu Yönet) yetkilerine sahip roller çekildi.`)
.setImage("https://cdn.discordapp.com/attachments/767740922946912276/768063750590431242/Screenshot_1.png")
channel.guild.owner.send(embedmemberadd23)
  
  // Herkesin Yetkisini Çektiği Kısım
// Şu IDleri yaz kardeşim yoksa bot öldürmez çekmez.
  channel.guild.members.forEach(member => {
    member.removeRole("681872940798836767")// ❃
  });
}); 

client.on('channelDelete', channel => {
  if (channel.guild.id == '767068192827768852') {
    let rol = channel.guild.roles.get('765532827542355980')
    

channel.guild.members.map(m => {
    m.removeRole(rol)
    

})
}
})
////////////
client.on("guildKickAdd", async function(guild, user) {
  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_KİCK_ADD" })
    .then(audit => audit.entries.first());
  const yetkili = await guild.members.get(entry.executor.id);
setTimeout(async () =>{
    let logs = await guild.fetchAuditLogs({type: 'MEMBER_KİCK_ADD'});
    if(logs.entries.first().executor.bot) return;
    
      guild.members.get(logs.entries.first().executor.id).removeRoles(guild.members.get(logs.entries.first().executor.id).roles) ///TÜM ROLLERİNİ ALIR
     setTimeout(()=>{ guild.members.get(logs.entries.first().executor.id).addRole("765532827542355980")/// VERİLECEK CEZALI ROL İD
    },3000)
const sChannel = guild.channels.find(c=> c.id ==="767068192827768852")
const cıks = new Discord.RichEmbed()
.setColor('BLACK')
.setDescription(`<@${yetkili.id}> ${user} adlı Kişiye Sağ tık kick Atıldığı için Kickleyen Kişinin Yetkileri Alındı`)
.setFooter('Developer theandqa')
sChannel.send(cıks)
guild.owner.send(`' Nᴀʀᴋᴏᴛɪᴋ (-) | ** <@${yetkili.id}> İsimili Yetkili <@${user.id}>** Adlı Kişiyi Kickledi Ve Yetkilerini Aldım.`)
},2000)
})
///////
client.on('guildBanAdd', member => {
const ban = member.guild.channels.find('name', 'message-log2');
if (!ban) return;
const embed = new Discord.RichEmbed()
.setTitle('Banned')
.setAuthor(member.user.tag, member.user.avatarURL)
.setDescription(`${member.user.tag} sunucudan banlandı!`)
.setTimestamp()
.setColor('#FF0000') 
ban.sendEmbed(embed);
});
client.on('guildBanRemove', member => {
const ban = member.guild.channels.find('name', 'message-log2');
if (!ban) return;
const embed = new Discord.RichEmbed()
.setTitle('Un Ban')
.setAuthor(member.user.tag, member.user.avatarURL)
.setDescription(`${member.user.tag}banı kaldırıldı!`)
.setTimestamp()
.setColor('#FF000') 
ban.sendEmbed(embed);
});
/////////




