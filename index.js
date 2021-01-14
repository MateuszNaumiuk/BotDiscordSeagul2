// Projekt stworzony na serwer glosowy discord
// pomysly zostaly dostarczone przez uzytkownikow serwera
// data stworzenia 12/19/2020

const Discord = require("discord.js");
const { prefix, token, muzyka, testi, glosowy} = require("./config.json");
const ytdl = require("ytdl-core");
const client = new Discord.Client();
const queue = new Map();

/* Przy odpalaniu wyswietla active w cmd */
client.on("ready", () => {
    console.log('Active');
});

/* Stworzenie prefixu i sprawdzanie jego stanu przy komendach */
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  /* Komendy muzyczne do grania */
  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  }else if (message.content.startsWith(`${prefix}queue`)) {
    queue123(message, serverQueue);
    return;
  }else if (message.content.startsWith(`${prefix}exit`)) {
    exit(message, serverQueue);
    return;
  }
  else {
    message.channel.send("?");
  }
});

/* Gdy bot ma problemy pisze bledy */
async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send("Wejdz na kanal");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("Nie mam permisji");
  }

   /* Pobranie url do bota */
  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

    /* Ustawienia bota */
  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    /* Tworzenie queue */
    queue.set(message.guild.id, queueContruct);
    queueContruct.songs.push(song);

    /* dalej queue */
    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} dodano do kolejki!`);
  }
}

/* embedy do queue */
const queueno = new Discord.MessageEmbed()
    .setColor('#FFE100')
    .setTitle("Jeszcze nie dodano systemu wyswietlania kolejki")
const queuetak = new Discord.MessageEmbed()
    .setColor('#FFE100')
    .setTitle("Brak Queue")

/* Funkcja queue */
function queue123(message, serverQueue, song) {
    if(!serverQueue){
      return message.channel.send(queuetak);
    }else{
      return message.channel.send(queueno);
    };
}

/* Funkcja exit */
function exit(message, serverQueue) {
  serverQueue.connection.dispatcher.end();
  return message.channel.send("Wychodze");
}

/* Fukcja skip */
function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send("Musisz byc na kanale zeby stopowac");
  if (!serverQueue)
    return message.channel.send("Nie moge stopowac.");
  serverQueue.connection.dispatcher.end();
}

/* Funkcja stop */
function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send("Musisz byc na kanale zeby stopowac");
  if (!serverQueue)
    return message.channel.send("Nie moge stopowac.");
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

/* Funkcja play */
function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`bede spiewac: **${song.title}**`);
}

/* tekst */
let tekst = [
    "Życie ludzkie jest bezcenne, ponieważ jest darem Boga, którego miłość nie ma granic. A kiedy Bóg daje życie, daje je na zawsze.",
    "Nie potrafi przebaczać innym, kto sam nie zaznał przebaczenia.",
    "Nie daj się zwyciężyć złu, ale zło dobrem zwyciężaj.",
    "Miłość, która jest gotowa nawet oddać życie, nie zginie.",
    "Wiara i rozum są jak dwa skrzydła, na których duch ludzki unosi się ku kontemplacji prawdy.",
    "Wczoraj do ciebie nie należy. Jutro niepewne... Tylko dziś jest twoje.",
    "Nie żyje się, nie kocha się, nie umiera się - na próbę.",
    "Wymagajcie od siebie choćby inni od was nie wymagali.",
    "W każdym razie, tutaj, w tym mieście, w Wadowicach wszystko się zaczęło. I życie się zaczęło, i szkoła się zaczęła, studia się zaczęły i teatr się zaczął. I kapłaństwo się zaczęło.",
    "Bogatym nie jest ten, kto posiada, ale ten, kto „rozdaje”, kto zdolny jest dawać.",
    "Być człowiekiem sumienia to znaczy wymagać od siebie, podnosić się z własnych upadków i ciągle na nowo się nawracać.",
];

/* Obrazki */
let obrazki = [
    "http://www.catholicnewsagency.com/images/Pope_John_Paul_II_Credit_LOsservatore_Romano.jpg",
    "http://elenabrezza.myblog.it/wp-content/uploads/sites/86123/2015/04/bl-john-paul-ii-prayer-card.jpg",
    "http://4.bp.blogspot.com/-fjtrnMkHY34/VJOVA-K-8qI/AAAAAAAAFME/zDAkRkiDSSQ/s1600/pope%2Bjohn9.jpg",
    "http://solidarnosc.wroc.pl/wp-content/uploads/2018/10/jpa2-e1554192580152.jpg",
    "http://frombork.art.pl/old.www.frombork.art.pl/Frombork-foto/JP2.jpg",
    "https://zyjesz.pl/wp-content/uploads/2020/04/dfsfs-800x600.jpg",
    "http://www.batallercontenidos.com/media/imagenes/00028000/00028040.jpg",
    "http://4.bp.blogspot.com/-O8bw_Ea66Yw/U2CTXkbkq0I/AAAAAAAACc0/zYVxSQGfFDs/s1600/karol.jpg",
    "https://pbs.twimg.com/profile_images/1692197152/profile_400x400.jpg",
    "http://2.bp.blogspot.com/-9rel7oWGjP4/UT4tGyFxt2I/AAAAAAAAJUU/wDkP6FDGcY8/s1600/0.jpg",
    "https://quibrianzanews.com/wp-content/uploads/2018/05/karol-wojtyla.jpg",
    "https://www.primocanale.it/immagininews/thumbs/139508-420x236.jpg"
]

/* Bot wysyla embed co 24h z losowym obrazkiem oraz losowa wiadomoscia z puli*/
setInterval(async function() {
    let channel = client.channels.cache.get(glosowy) || await client.channels.fetch(glosowy)
  
    if(!channel) return;
    const connection = await channel.join();
    connection.play(ytdl(muzyka))

    let random = Math.floor(Math.random() * 11);
    const Embed = new Discord.MessageEmbed()
    .setColor('#FFE100')
    .setTitle(tekst[random])
    .setAuthor('Jan Pawel II')
    .setImage(obrazki[random])
    .setFooter('21:37 [*]')
    client.channels.cache.get(testi).send(Embed);
}, 86400000);

/* Token do bota */
client.login(token);
