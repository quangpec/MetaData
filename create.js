// // var MongoClient = require('mongodb').MongoClient;
// // //Create a database named "mydb":
// // var url = "mongodb://localhost:27017/mydb";
// const mongodb = require('mongodb');
// const ObjectId = mongodb.ObjectId;

// // MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },function(err, db) {
// //   if (err) throw err;
// //   console.log("Database created!");
// //   db.close();
// // });

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }, async function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("project");
// //   var user = [
// //     { name: 'admin',email: 'abc@1231.com',password: '12345678' ,administrators: true , avt: 'image1.jpge'},
// //     { name: 'Peter',email: 'abc@1232.com',password: '12345678',administrators: false , avt:'image2.jpge'},
// //     { name: 'Amy',email: 'abc@1233.com',password: '12345678' ,administrators: false, avt: ''},
// //     { name: 'Hannah',email: 'abc@1234.com',password: '12345678',administrators: false , avt:'image3.jpge'},
// //     { name: 'Michael',email: 'abc@1235.com',password: '12345678',administrators: false , avt: ''},
// //     { name: 'Sandy',email: 'abc@1236.com',password: '12345678',administrators: false , avt: ''},
// //     { name: 'Betty',email: 'abc@1237.com',password: '12345678',administrators: false , avt: ''},
// //     { name: 'Richard',email: 'abc@1238.com',password: '12345678',administrators: false , avt:'image4.jpge'},
// //     { name: 'Susan',email: 'abc@1239.com',password: '12345678',administrators: false , avt: ''},
// //     { name: 'Vicky',email: 'abc@12310.com',password: '12345678',administrators: false , avt: ''},
// //     { name: 'Ben',email: 'abc@12311.com',password: '12345678',administrators: false , avt:'image5.jpge'},
// //     { name: 'William',email: 'abc@12312.com',password: '12345678',administrators: false , avt: ''},
// //     { name: 'Chuck',email: 'abc@12313.com',password: '12345678',administrators: false , avt: ''},
// //     { name: 'Viola',email: 'abc@12314.com',password: '12345678',administrators: false , avt: 'image8.png'},
// //     { name: 'Lê Văn A',email: 'abc@12315.com',password: '12345678',administrators: false , avt: 'image0.png'}
// //   ];
// //   var project = [
// //     {title: 'Xây Nhà Cho Admin1' , target: 10000 , description: 'Xây nhà cho người nghèo' , imageUrl:'image91.jpg' ,limitation: new Date(2029,12, 30)},
// //     {title: 'Xây Nhà Cho Admin2' , target: 100000 , description: 'Xây nhà cho người không nghèo' , imageUrl:'image907.jpg' ,limitation: new Date(2025,2,30)}, 
// //     {title: 'Xây Nhà Cho Admin3' , target: 10000 , description: 'Xây nhà cho người nghèo' , imageUrl:'image92.jpg' ,limitation: new Date(2028,12, 30)},
// //     {title: 'Xây Nhà Cho Admin4' , target: 100000 , description: 'Xây nhà cho người không nghèo' , imageUrl:'image906.jpg' ,limitation: new Date(2025,3,30)}, 
// //     {title: 'Xây Nhà Cho Admin5' , target: 10000 , description: 'Xây nhà cho người nghèo' , imageUrl:'image93.jpg' ,limitation: new Date(2027,12, 30)},
// //     {title: 'Xây Nhà Cho Admin6' , target: 100000 , description: 'Xây nhà cho người không nghèo' , imageUrl:'image905.jpg' ,limitation: new Date(2025,4,30)}, 
// //     {title: 'Xây Nhà Cho Admin7' , target: 10000 , description: 'Xây nhà cho người nghèo' , imageUrl:'image94.jpg' ,limitation: new Date(2026,12, 30)},
// //     {title: 'Xây Nhà Cho Admin8' , target: 100000 , description: 'Xây nhà cho người không nghèo' , imageUrl:'image904.jpg' ,limitation: new Date(2025,5,30)}, 
// //     {title: 'Xây Nhà Cho Admin9' , target: 10000 , description: 'Xây nhà cho người nghèo' , imageUrl:'image95.jpg' ,limitation: new Date(2025,12, 30)},
// //     {title: 'Xây Nhà Cho Admin10' , target: 100000 , description: 'Xây nhà cho người không nghèo' , imageUrl:'image903.jpg' ,limitation: new Date(2025,6,30)}, 
// //     {title: 'Xây Nhà Cho Admin11' , target: 10000 , description: 'Xây nhà cho người nghèo' , imageUrl:'image96.jpg' ,limitation: new Date(2024,12, 30)},
// //     {title: 'Xây Nhà Cho Admin12' , target: 100000 , description: 'Xây nhà cho người không nghèo' , imageUrl:'image902.jpg' ,limitation: new Date(2025,7,30)},
// //     {title: 'Xây Nhà Cho Admin13' , target: 10000 , description: 'Xây nhà cho người nghèo' , imageUrl:'image97.jpg' ,limitation: new Date(2023,12, 30)},
// //     {title: 'Xây Nhà Cho Admin14' , target: 100000 , description: 'Xây nhà cho người không nghèo' , imageUrl:'image901.jpg' ,limitation: new Date(2025,8,30)}, 
// //     {title: 'Xây Nhà Cho Admin15' , target: 10000 , description: 'Xây nhà cho người nghèo' , imageUrl:'image98.jpg' ,limitation: new Date(2022,12, 30)},
// //   ];
// //   dbo.collection("project").insertMany(project, function(err, res) {
// //     if (err) throw err;
// //     console.log("Number of documents inserted: " + res.insertedCount);
// //   });
// //   dbo.collection("users").insertMany(user, function(err, res) {
// //     if (err) throw err;
// //     console.log("Number of documents inserted: " + res.insertedCount);
// //   });
// const  user   =  await  dbo.collection("users").find({}).toArray(); 
// const project =  await  dbo.collection("project").find({}).toArray();
//         var contribute = [
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},
//             {userID: ObjectId(user[1]._id), projectID : ObjectId(project[1]._id), contributionAmount: 1000},

//         ];

//        const a =  await dbo.collection("contribute").insertMany(contribute)
//     //console.log(result);



//   db.close();
// });
"use strict";
// const nodemailer = require("nodemailer");

// // async..await is not allowed in global scope, must use a wrapper
// async function main() {
//   // Generate test SMTP service account from ethereal.email
//   // Only needed if you don't have a real mail account for testing
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'quanglnFX13841@funix.edu.vn', // generated ethereal user
//       pass: 'La242119@', // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: 'quanglnFX13841@funix.edu.vn', // sender address
//     to: "nhoccontizen@gmail.com", // list of receivers
//     subject: "welcome to abc.com", // Subject line
//     text: "Chào mừng bạn đến với abc.com mã xác thực của bạn là :" + '012345' +" mã xác thực có giá trị trong 5 phút" , // plain text body
//     html: "<b>Chào mừng bạn đến với abc.com mã xác thực của bạn là :" + '012345' +" mã xác thực có giá trị trong 5 phút</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
// }

// main().catch(console.error);

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({version: 'v3', auth: authClient});
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log('No files found.');
    return;
  }

  console.log('Files:');
  files.map((file) => {
    console.log(`${file.name} (${file.id})`);
  });
}

authorize().then(listFiles).catch(console.error);