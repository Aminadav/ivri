//@ts-check
var app=require('express')()
var cors=require('cors')
var db=require('./db')
const FormData = require('form-data');
var axios=require('axios').default
require('dotenv').config()

app.use(cors())
app.use((req,res,next)=>{
  try {
    if(req.headers.auth)
    //@ts-ignore
    req.email=decrypt(req.headers.auth)
    next()
  } catch(err){
    next()
  }
})
app.use((req,res,next)=>{
  console.log(req.method + ' ' + req.url)
  next()
})
app.post('/is-web-view',(req,res)=>{
  var userAgent=req.headers['user-agent'] || ''
  console.log(userAgent)
  var isWebView
  var userAgent = userAgent.toLowerCase(),
    safari = /safari/.test( userAgent ),
    ios = /iphone|ipod|ipad/.test( userAgent );

  if( ios ) {
      if ( safari ) {
        isWebView=false
      } else if ( !safari ) {
        isWebView=true
      };
  } else {
    // Android
    isWebView=!! (req.headers['HTTP_X_REQUESTED_WITH'] || req.headers['http_x_requested_with'])
  };
  res.send({isWebView})
})
app.get('/',(req,res)=>{
  res.send("Server up and running:" + new Date())
})
var port=3943
console.log('Listening to port:',port)
app.listen (port)

app.use(require('express').json())


app.post('/save-calendar',async (req,res)=>{
  var isFullDay=req.query.is_full_day=="true"
  console.log({isFullDay})
  try {
    await db.query('update calendars set json=' + db.objectToJsonSet({
      name:req.body.name,
      dates:req.body.dates
    }) + ' where id=?',[req.body.calendarId],true)

    //@ts-ignore
    var email=req.email
    console.log({email})
    var token=await googleAuth.getTokenByEmail(email)
    console.log({token})
    var calendar=await db.queryRow("select * from calendars where id=?",[req.body.calendarId])
    var headers={
      'Authorization':"Bearer " + token
    }
    /** @type {any} */
    var body={
      summary:calendar.name,
      description:'נוצר על ידי ivri.boti.bot',
      timeZone:'Asia/Jerusalem'
    }
    console.log({googleCalendarId:calendar.googleCalendarId})
    if(calendar.googleCalendarId) {
      // try {
        //   var aRes=await axios.delete(`https://www.googleapis.com/calendar/v3/calendars/${calendar.googleCalendarId}`,{headers})
        // } catch(err) {
          //   if(err.response) {
            //     console.log(err.response.data)
            //   }
            // }
            try {
        console.log('Get all events')
        var aRes=await axios.get(`https://www.googleapis.com/calendar/v3/calendars/${calendar.googleCalendarId}/events?singleEvents=true&maxResults=2500`,{headers})
        var recs = require('lodash.uniq')(aRes.data.items.map(x=>x.recurringEventId).filter(x=>x))
        for(let x of recs) {
          console.log('Delete all events: ',x)
          var aRes=await axios.delete(`https://www.googleapis.com/calendar/v3/calendars/${calendar.googleCalendarId}/events/${x}`,{headers})
          await delay(100)
        }
      } catch(err) {
        if(err.response) {
          console.log(err.response.data)
        }
      }
      // get list
    } else {
      console.log('Create new calendar')
      var aRes=await axios.post('https://www.googleapis.com/calendar/v3/calendars',body,{headers})
      var {id:googleCalendarId}=aRes.data
      await db.query('update calendars set json=' + db.objectToJsonSet({googleCalendarId}) + ' where id=?',[req.body.calendarId],true)
      calendar.googleCalendarId=googleCalendarId
    }
  

    var hebcal=require('hebcal')
    var hebdates=req.body.dates.trim().split('\n').map(x=>x.trim())
    for(var hebdate of hebdates) {
      var dates=[]
      var eventName=hebdate.split(' ').slice(2).join(' ')
      var hebDateName=hebdate.split(' ').slice(0,2).join(' ')
      var H=hebcal.HDate(hebDateName)
      for(var i=0;i<=50;i++) {
        dates.push(require('moment-timezone').tz(H.greg(),'Israel').hour(7).minutes(0))
        H.setFullYear(H.getFullYear()+1)
      }

      body={
        transparency:'transparent', // free
        summary:eventName,
        description:'העיברי',
        visibility:'private',
        start:  isFullDay ?{
          date:dates[0].format("YYYY-MM-DD")
         } : {
          dateTime:dates[0].toISOString(),
          timeZone:'Asia/Jerusalem'
        },
        end:  isFullDay ?{
          date:dates[0].add('1','day').format("YYYY-MM-DD")
         } :{
          dateTime:dates[0].clone().add(1,"minute").toISOString(),
          timeZone:'Asia/Jerusalem'
        },
        recurrence:[
          // `RDATE;VALUE=DATE-TIME:${firstStart},${endStart}`
          // "RDATE;VALUE=DATE-TIME:20230305T190000,20230306T190000,20230307T190000,20230308T190000"
          "RDATE;VALUE=DATE-TIME:" + 
          dates.slice(1).map(x=>x.format("YYYYMMDDTHHmmSS")).join(',')
        ]
      }
      console.log('posting new events')
      console.log({hebDateName,date:dates[1].toISOString(),eventName})
      var url=`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent( calendar.googleCalendarId)}/events`
      console.log(url)
      await axios.post(url,body,{headers})

      await delay(100)
    }
    console.log('done adding')
    res.send({saved:true})
    
    
  } catch(err) {
    if(err.response) {
      console.log(JSON.stringify(err.response.data))
    } else {
      console.log(err)
    }
    res.send({error:true})
  }
})
function delay(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
app.get('/user',async (req,res)=>{
  var auth=req.query.auth
  var email=decrypt(auth)
  for(var i=0;i<2;i++) { 
    // on second time we set up the calendars array for next step after for.lop
    // For safety We're not using do...while
    var calendars=await db.query('select * from calendars where json->>"$.email"=?',[email])
    if(calendars.length==0) {
      await db.query("insert into calendars set json=?",[JSON.stringify({
        email,
        name:'העיברי',      
      })])
    }
  }
  // now we have calendars=[...]
  res.send({
    email,
    calendars
  })
})
app.get('/callback_oauth',async (req,res)=>{
  try {
    var {access_token,refresh_token,expires_in,email,picture,given_name,family_name,name}=await googleAuth.handleCode(req.query.code)
    console.log('user autherized:',{email})
  
    
    var newUrl=String(req.query.state)
    // if(newUrl.match(/\?/)) newUrl+='&'; else newUrl+='?'
    newUrl+="#auth=" + encrypt(email)
    res.redirect(String(newUrl))
  } catch(err){
    console.log(err)
    console.log(err.response && err.response.data)
    res.send('error')
  }
})


const crypto = require('crypto');
const googleAuth = require('./google-auth');
const algorithm = 'aes-256-ctr';
function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, process.env.GOOGLE_SECRET)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  console.log('@',process.env.GOOGLE_SECRET)
  const decipher = crypto.createDecipher(algorithm, process.env.GOOGLE_SECRET)
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}


