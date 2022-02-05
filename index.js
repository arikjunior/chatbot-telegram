var TelegramBot = require('node-telegram-bot-api');
var PORT = process.env.PORT || 5000;
const axios = require('axios');
const fetch = require('node-fetch');
var token = '1018262281:AAEnJ6Ao7NraeurHCiH7P7vEaIrs6xQc0uI';
var bot = new TelegramBot(token, {polling:true});
var request = require('request');
//const appID = 'c1b799fc7447688198ef17263ef93cfd';
const titikCuaca = (city) => (
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric}&&appid=fde9f684b4f914241ebdb3139e71be71`
  );
const cuacaIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;
const parameterCuaca = (name, sys, main, weather, wind, clouds,) => (
    `Cuaca di kota <b>${name}</b>:
  Negara: <b>${sys.country}</b>
  <b>${weather.main}</b> - ${weather.description}
  Temperatur: <b>${main.temp} °C</b>
  Tekanan Udara: <b>${main.pressure} hPa</b>
  Kelembapan: <b>${main.humidity} %</b>
  Angin: <b>${wind.speed} meter/sec</b>
  Awan: <b>${clouds.all} %</b>
  `
);

//ketika mengetik /start
bot.onText(/\/start/, (msg) => {
    const opts = {
        reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Movie','Cuaca','Barang'],
                ['Toko Online'],
                ['Informasi Bot']
            ],
        })
    };
    bot.sendMessage(msg.chat.id, 'Selamat datang dilayanan SmartBot kami '+msg.from.first_name+', Saya adalah Bot yang akan melayani anda disni.', opts);
    console.log(msg)
});

//ketika menekan button Bot Info
bot.onText(/Informasi Bot/,(msg)=>{
  bot.sendMessage(msg.chat.id, "SmartBot 1.0", {
    reply_markup: {
      inline_keyboard: [[
          {
              text: 'Bantuan',
              callback_data: 'help'
          }, {
              text: 'Tentang',
              callback_data: 'about'
          }
      ]]
  }
});
});

//ketika mengklik button inline help
bot.on("callback_query", function (query){
  var data = query.data;
  var chat_id = query.message.chat.id;
  var message_id = query.message.message_id;
  const helpMessage = `
  Layanan SmartBot :
    Layanan Bot ini dimulai dengan menggunakan command /start
    /movie  - perintah untuk melihat film
    /cuaca  - perintah untuk melihat cuaca
    /barang - perintah untuk melihat barang
    /movie <nama film> - untuk melihat data dari film yang dicari
    /cuaca <nama kota> - untuk melihat data dari cuaca yang dicari
    /barang <nama barang> - untuk melihat data dari barang yang dicari
    Bot Info - berisi tentang help dan about
    `;

  if (data == "help"){
    bot.editMessageText(helpMessage,{chat_id,message_id});
  };
});

//ketika mengklik button inline about
bot.on("callback_query", function (query){
  var data = query.data;
  var chat_id = query.message.chat.id;
  var message_id = query.message.message_id;
  const aboutMessage = `
  About SmartBot :
    Smartbot adalah sebuah layanan yang dirancang untuk 
    berkomunikasi langsung dengan pelanggan secara cepat.
    Aplikasi : Visual Code Studio
    Library : Node-Telegram-Bot-Api
    Server : Heroku
    Bahasa Program : Java Script
    Pengerjaan : 09 Mei -> ... 2020
    Author : Kelompok E 
    `;

  if (data == "about"){
    bot.editMessageText(aboutMessage,{chat_id,message_id});
  };
});

//ketika mengklik button movie
bot.onText(/Movie/, (msg) => {
    bot.sendMessage(msg.chat.id, 'untuk mencari data film silahkan ketik /movie spasi (nama film)', {
    reply_markup: {
      inline_keyboard: [[
          {
              text: 'Data Film',
              url: 'https://www.imdb.com/'
          },
          {
              text: 'API Film',
              url: 'http://www.omdbapi.com/?apikey=6221cea4&t=avengers'
          }
      ]]
  }})
});

//ketika mengklik button barang
bot.onText(/Barang/, (msg) => {
  bot.sendMessage(msg.chat.id, 'untuk mencari data barang silahkan ketik /barang spasi (nama barang)', {
  reply_markup: {
    inline_keyboard: [[
        {
            text: 'Data Barang',
            url: 'https://www.bukalapak.com/'
        },
        {
            text: 'API Barang',
            url: 'https://www.bukalapak.com/omniscience/v2?word=ryzen&omni_revamp=true&user=ed441d3d70e6981c8a98caa34e7a4827&key=a824305f8402155242f53d232f0954e8'
        }
    ]]
}})
});

//ketika mengklik button cuaca
bot.onText(/Cuaca/, (msg) => {
  bot.sendMessage(msg.chat.id, 'untuk mencari data cuaca silahkan ketik /cuaca spasi (nama kota)', {
    reply_markup: {
      inline_keyboard: [[
          {
              text: 'Data Cuaca',
              url: 'https://openweathermap.org/'
          },
          {
              text: 'API Cuaca',
              url: 'http://api.openweathermap.org/data/2.5/weather?q=jember&units=metric}&&appid=fde9f684b4f914241ebdb3139e71be71'
          }
      ]]
  }})
});

//ketika mengklik button online shop
bot.onText(/Toko Online/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Daftar Toko Online', {
    reply_markup: {
      inline_keyboard: [[
          {
              text: 'Shopee',
              url: 'https://shopee.co.id/'
          },
          {
            text: 'Tokopedia',
            url: 'https://www.tokopedia.com/'
          },
          {
              text: 'Lazada',
              url: 'https://www.lazada.co.id/'
          }
      ]]
  }})
});

//Summon Data Film
bot.onText(/\/movie/, (msg, match) => {    
    const chatId = msg.chat.id;
    const movie = match.input.split(' ')[1];

    if (movie === undefined) {
        bot.sendMessage(
          chatId,
          `Tolong masukkan nama film`
        );
        return;
      }
    request(`http://www.omdbapi.com/?apikey=6221cea4&t=${movie}`, function(error,response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(chatId, '_Melihat Data Dari Film _'+ movie , {parse_mode:'Markdown'})
            .then(function(msg){
                var res = JSON.parse(body);
                bot.sendPhoto(chatId,res.Poster,{caption:'Hasil Pencarian:\n Judul: ' + res.Title + 'n _Tahun: ' + res.Year + '\n Rating: ' + res.Rated + '\n Rilis: ' + res.Released + '\n Durasi: ' + res.Runtime + '\n Genre: ' + res.Genre + '\n BoxOffice: ' +res.BoxOffice + '\n Aktor: ' + res.Actors +'\n Penulis : ' + res.Writer + '\n Bahasa : ' + res.Language + '\n Negara : ' + res.Country + '\n Alur : ' + res.Plot + '\n Situs: ' + res.Website },{
                  parse_mode:"HTML"
                }
              )
                  
            })
        }
    });        
});

//Summon Data Cuaca
const getCuaca = (chatId, city) => {
  const titik = titikCuaca(city);

  axios.get(titik).then((resp) => {
    const {
      name,
      sys,
      main,
      weather,
      wind,
      clouds
    } = resp.data;
    bot.sendMessage(chatId, '_Melihat Data Dari Kota _'+ city , {parse_mode:'Markdown'})
    bot.sendPhoto(chatId, cuacaIcon(weather[0].icon))
    bot.sendMessage(chatId,parameterCuaca(name, sys, main, weather[0], wind, clouds), {
        parse_mode: "HTML"
      }
    );
  }, error => {
    console.log("error", error);
    bot.sendMessage(chatId,`Ooops...Saya tidak bisa mendapatkan cuaca <b>${city}</b>`, {
        parse_mode: "HTML"
      }
    );
  });
}
bot.onText(/\/cuaca/, (msg, match) => {
  const chatId = msg.chat.id;
  const city = match.input.split(' ')[1];

  if (city === undefined) {
    bot.sendMessage(
      chatId,
      `Tolong masukkan nama kota`
    );
    return;
  }
  getCuaca(chatId, city);
});

//Summon Data Barang
bot.onText(/\/barang/, (msg, match) => {    
  const chatId = msg.chat.id;
  const barang = match.input.split(' ')[1];

  if (barang === undefined) {
      bot.sendMessage(
        chatId,
        `Tolong masukkan nama barang`
      );
      return;
    }
//shopee.co.id   
//fetch(`https://shopee.co.id/api/v2/search_items/?by=relevancy&keyword=${barang}&limit=50&newest=0&order=desc&page_type=search&version=2`, {

//blibli.com
//fetch(`https://www.blibli.com/backend/search/products?page=1&start=0&searchTerm=${barang}&intent=true&merchantSearch=true&multiCategory=true&customUrl=&channelId=web&showFacet=true`, {

fetch(`https://www.bukalapak.com/omniscience/v2?word=${barang}&omni_revamp=true&user=ed441d3d70e6981c8a98caa34e7a4827&key=a824305f8402155242f53d232f0954e8`, {
   /* "headers": {
      "accept": "application/json, text/plain, *//*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.5",
      "connection": "keep-alive",
      "cookie":"_gcl_au=1.1.2068287503.1587905...9797571;welcomePkgShown=true",
      "host":"shopee.co.id",
      "if-none-match-":"55b03-917a20cc631bcd4e7acbc057a49e0598",
      "referer":`https://shopee.co.id/search?keyword=${barang}`,
      "te":"Trailers",
      "user-agent":"Mozilla/5.0(Windows NT 10.0;...) Gecko/20100101 Firefox/76.0",
      "x-api-source":"pc",
      "x-requested-with":"XMLHttpRequest"
    }*/

    /*"headers": {
      "Host": "www.blibli.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0",
      "Accept": "application/json, text/plain, *//*",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      "channelId": "web",
      "x-b3-traceid": "b6ca0f4009c9d500",
      "Referer": `https://www.blibli.com/jual/${barang}?page=1&start=0&searchTerm=${barang}&intent=true&merchantSearch=true&multiCategory=true&customUrl=&sort=0&category=AK-1000002`,
      "Connection": "keep-alive",
      "Cookie": "_gcl_au=1.1.50112322.1583503247; __bwa_user_id=1916329177.U.5790182179574240.1583503247; __bwa_user_session_sequence=5; __utma=205442883.751283404.1583503249.1583503249.1583503249.1; __utmz=205442883.1583503249.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); _ga=GA1.2.751283404.1583503249; __auc=33875bb0170b0260cfb503efafb; _fbp=fb.1.1583503249277.1856187009; _hjid=818506ab-ebdc-4d5a-a869-b01c3c6698cb; _cc_dc=2; _cc_id=621487869274722920281d2c91e82a78; _abck=AF1847EB0A25EBEB365DD7B86F213F93~0~YAAQ5V9idl8IlR5yAQAAfazzJgM2E2832Rkzvb7rO2a6TSk2eP/WymuSf1RVnCW/A9IL8gtx+2FtrdItaA1lnJn+s/wYRHTpKiso0Ns4Zoh+v/Bujx28zNlmTrGvYORAjf8ZMhO3ued214yLq19x84t+2o8OMg/09jm4CyxvVa3QoTAXdfJNpzXAKcFhIsVhQmH30Nv4bPbAIjxK5lmcHh3GEDbdEI+Y/tLM2NfNAXkXiR1AGPttATbCYHAjiikBvuHkCbU9Bb1nZnpQmD+8K7FuocTfkGIm/LcGe4/byjKdS4rjrtkBWlWaX5iAalc9678gSnrWYw==~-1~-1~-1; insdrSV=4; ins-neverloggedinuser=1; cto_bundle=z61klF9VZXZoU2t3V3BuVCUyQmFQV0VlVk42WjFEZXJlJTJCT2xWQnFuQjVIR3hIaU50QWcyR0lXSDZ5YnlhM2t4czhqZ3J4anptNUdiWiUyRnBFRDhENldXTzJpbk5HdXFtNmslMkY0anJ0bzclMkJGdHhFalhUQVdRRk5tRSUyQmhwSjByekJQZDVBaFV1WmdJRTFKUFRXa2hHYktUVEpvdG5kVnclM0QlM0Q; ak_bmsc=990FFF0DDE9837E7FD5D684ECF64B40576625FE5FB1D0000AA4AC25E5DB5A169~pl4bReOP+5VYcxRwIK3KfkNOmTAdoEWDfdkTX3upc0Nt18pqUG7+nE2cs6SLIAxEB7aLMNTJ1NXkVwrDnYi0uvypwTCpUj24XyDJP3vmKv4AYWpQP7V9N4ytiPVBJ4YPmUCadtD+Zhw/XMBqeOIMUiL0X2EwyFuoEb9cwLDEZe23LIPO9e+dgR3e6aNfzntJcVttKx8S68JNPJZKpXnvtE9dOInuMnaEPzeQBDnKmfBlR5GYJEJoyoxKvQzbQhThBd; bm_sz=2DEEEA09656FDF7CDC4AE6ED7555EC2F~YAAQ5V9idlgIlR5yAQAA8KrzJgcdJXQVwaQNxb7OL2Nwma32cZ7IoD02zBwNjZzOqPhpXPQrZSxDeG96NijDWkZH5Kt6p+SRdRSsW6UvlcTo2dEls4+Jgj7CLgwG2dQEQwZz2KelZP0jXjJ8dbHjqu0i3xB2mm6fcsOEjqlYlvAEVKYwW9NTZdIUxjsLcp/J; bm_sv=2B292864DEE4D578E5D347DB975E75A5~8LKmmdbRzmB0VvbqHpO8EwVNpLx4La49Fgkt8oo411j/9Bor4LYyCMIpO8pQtC7m2L/Um2AHE2uMPbc2CpC0ViyXPBaI04KecJi4UQ2Q3q83/THYOu9eYfy7JFTWj/VBBpy76njvKSCIKuqOUT9XE74GT2fFZbw8fH85nHyvKpU=; Blibli-User-Id=8cf2f808-6105-49a3-9134-0720a4cff9e4; Blibli-Is-Member=false; Blibli-Is-Remember=false; Blibli-Session-Id=d808a654-1a52-4bb3-a515-c33fff019589; Blibli-Signature=4ff9ea58f5a4eb756e921262fa628c2d26fe6a66; __bwa_session_action_sequence=6; __bwa_session_id=723337755.S.7543951331305978.1589791404; ins-gaSSId=9c80285b-1536-8507-a465-e5a5ee70d9cf_1589791405; bm_mi=E77DE05EBF30DAD91BCBA6266C72253D~GNudnwR/pa2FAzgzGShnaftJgWwGRV+JNqK9dgMqwsTxth6CJyw137gYexWCBNKu6OAHP+/WAW86WvjWFuPOEvwuw2Kuyc+rFH1nGDmoBjxVqd7uc+j9Yix6gP32eWRJ9DiTyHdkdfZL8Fjz+60FkVgdQcoNWbIM7aolEerd2OPL4tlDvlXKIaGyqE+79B6BMIl+R/rNsSILKLKqVtafg1yXhOUHYNH7GY8gUA0IZgupIyqyPDZq+2Sk1HjoKkzATPRvNM4dMWXN1IaFwuFFR0z44aQKMoog7/43UR21Hnw=; JSESSIONID=0D044DE8167D95E98DBF6F8FABE9A78F; __asc=cd0096d817226f3bf21ae1379a5; _gid=GA1.2.1940380580.1589791408; _dc_gtm_UA-21718848-13=1; _gat_UA-21718848-13=1",
      "TE": "Trailers"
    }*/

    "headers": {
    "Host": "www.bukalapak.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0",
    "Accept": "/",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://www.bukalapak.com/",
    "Connection": "keep-alive",
    "Cookie": "cfduid=dc899948c80a8d7229de741ea4128339e1589185508; identity=5724e866165c5a8a570379dc5bf36e88; browser_id=ed441d3d70e6981c8a98caa34e7a4827; _gcl_au=1.1.777306075.1589185509; _fbp=fb.1.1589185515267.420558475; _ga=GA1.2.1290365371.1589185515; _vwo_uuid_v2=DB5B6304AB825A0E829ECDA0CE5736D73|2ff40a0ed0b335fc64574ef60a26ecd6; kppid_managed=kppidff_NR-q-6V7; cto_bundle=lYF7W19VZXZoU2t3V3BuVCUyQmFQV0VlVk42Wjg0RDZISHNySGVnUW5VdEJhNEwzdjM3aFhFVDFtaTdMUjVxblhzUFo1TDVrZmxVNlMlMkZSNjNnVDhTdnBoczN0VEVMTlVwQjBjdGdXJTJCeW9WenFQQmxpc1pkMVJmaTgydEZETzBWdjFTYmM1VElDZVMlMkZWQlR1JTJGaWh1bmNRTDFyTGNRJTNEJTNE; session_id=3c510362f59a8ea27b8d8fad5bf534a3; lskjfewjrh34ghj23brjh234=a3dXRXJqTFc5aElwR0QvM0VzQzE1TEhValhTMXNUNTVaWlAxWHNRRVNlSk0rU0xYMWM3T2hpeG5wdURoUmxxUC9oRXZ1VldvblpNdlplb21ETTdnTnF0bzhtMGRKaTBMZGNDbklMb0N1ZnhaT3QwWlZzNlZYVnNqdVJkeUM1Y2h5TDZ3S3FpOHhRSm51eitzVE1ORWNBRENrVE83bmdPcVI0dWNEQXFCWTNsM2M5TUQzVnAwNnI2UWJBaExwNjhiLS1LSjdEdElpUFpBVnV1S2o4SEtwM3B3PT0%3D--eb8c00d5197c240dce4bde3b5208c7e89f394d32; cfruid=025aac693da4444b6274f1294d55d06c45e7505f-1589791970; asc=44726ffa17226fc66d0e7a5a65d; auc=44726ffa17226fc66d0e7a5a65d; _td=5dab0662-92b6-4d9d-99ae-8fa06649a04b; _gid=GA1.2.1335587912.1589791977; _gat=1",
    "TE": "Trailers"
    }
  })
  .catch(err => console.log(err))
  .then(res => res.json())
  .then(json => {
    bot.sendMessage(chatId, '_Melihat Data Dari Barang _'+ barang , {parse_mode:'Markdown'})
    json.product.forEach(element => {
      bot.sendPhoto(chatId,element.img,{caption: '\n Nama: ' + element.name + '\n Harga: ' + element.price + '\n url: '+ 'https://www.bukalapak.com'+ element.url}
    );
  })
});  
});


process.on('uncaughtException', function (error) {
	console.log("\x1b[31m", "Exception: ", error, "\x1b[0m");
});

process.on('unhandledRejection', function (error, p) {
	console.log("\x1b[31m","Error: ", error.message, "\x1b[0m");
});