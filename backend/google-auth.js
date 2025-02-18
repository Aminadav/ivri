const { default: axios } = require('axios');
const FormData = require('form-data');
const dbJSON = require('./db-json');
var googleAuth={}
module.exports=googleAuth
var tokensDB=dbJSON.create(__dirname +'/tokens.json')

googleAuth.handleCode=async function(code){
  var body = new FormData();
  body.append('grant_type',`authorization_code`)
  body.append('code',`${code}`)
  body.append('redirect_uri',process.env.REDIRECT_URI)
  body.append('client_id',process.env.GOOGLE_CLIENT_ID)
  body.append('client_secret',process.env.GOOGLE_SECRET)

  var r=await axios.post(`https://oauth2.googleapis.com/token`,body,{headers:body.getHeaders()})
  var {access_token,refresh_token,expires_in}=r.data

  var r=await axios(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`)
  console.log(r.data)
  var {email,picture,given_name,family_name,name}=r.data

  
  var obj={
    access_token,
    refresh_token,
    token_expired: new Date().valueOf()+(expires_in-60)*1000,
    picture,
    email,
    given_name,
    family_name,
    name
  }

  var current=await tokensDB.get({})
  current[email]=obj
  tokensDB.set(current)
  return obj
}

googleAuth.getTokenByEmail=async function(email) {
  var current=await tokensDB.get({})
  if(!current[email]) return
  if(current[email].token_expires<new Date().valueOf()) {
    return current[email].access_token
  }
  var {access_token,expires_in}=await googleAuth.getTokenFromRefreshToken(current[email].refresh_token)
  
  current[email].access_token=access_token
  current[email].token_expired=new Date().valueOf()+(expires_in-60)*1000

  await tokensDB.set(current)
  return current[email].access_token
}

googleAuth.getTokenFromRefreshToken=async function(refresh_token) {
  var body = new FormData();
  body.append('grant_type',`refresh_token`)
  body.append('refresh_token',refresh_token)
  body.append('client_id',process.env.GOOGLE_CLIENT_ID)
  body.append('client_secret',process.env.GOOGLE_SECRET)
  var r=await axios.post('https://accounts.google.com/o/oauth2/token',body)
  return {
    access_token:r.data.access_token,
    expires_in:r.data.expires_in
  }
}