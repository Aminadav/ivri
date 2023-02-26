import { useState } from "react"
import store from "../store"
import axios from 'axios'
import myAxios from "../myAxios"
import { Button, CircularProgress, TextareaAutosize, TextField } from "@mui/material"
export default function OneCalendar(){
  var [draftList,setDraftList]=useState(store.getCurrentCalendar().dates || '')
  store.useRerenderIfChange(()=>[store.getCurrentCalendar])
  function showExample(){
    if(draftList.trim().length>0) {
      alert('בשביל לראות דוגמא תמחקו את כל התאריכים שהכנסתם')
      return
    }
    setDraftList(`
    ח שבט עמינדב
    ג טבת נתנאלה
    `.trim().split('\n').map(x=>x.trim()).join('\n'))
  }
  function clickReset() {
    if(draftList.trim().length==0) return
    if(!confirm(`בטוחים?`)) return
    setDraftList('')
  }
  var [saving,set_saving]=useState(false)
  async function clickSave(){
    var reg =new RegExp("^(?<yom>[א-ל'\"]{1,3})[ \n]ב?(?<hodesh>(תשרי|חשון|חשוון|כסלו|כסליו|טבת|שבט|אדר|ניסן|איר|אייר|סיוון|סיון|תמוז|אב|אלול)) (?<message>.{2,50})$")
    var lines=draftList.trim().split('\n')
    for(var i=0;i<lines.length;i++) {
      var line=lines[i]
      var match=line.match(reg)
      if(!match) {
        alert('השורה הבאה לא תקינה:\n' + line)
        return
      }
    }
    store.getCurrentCalendar().dates=draftList
    set_saving(true)
    var res=await myAxios().post((process.env.REACT_APP_BACKEND || 'https://api-ivri.boti.bot') + '/save-calendar',{
      calendarId:store.calendarId,
      name:store.getCurrentCalendar().name,
      dates:store.getCurrentCalendar().dates
    })
    set_saving(false)
    if(res.data.error) {
      alert('שמירה לא הצליחה. ייתן ולא נתת הרשאת ליצירת אירועים. נסה להתנתק ולהתחבר מחדש.')
    } else {
      alert('נשמר בהצלחה.')
    }
    
  }

  return <div css={``}>
    {/* <a onClick={()=>store.navigate('my-calendars')}>חזרה</a> */}
    <div css={`display:fles;`}>
      <div css={`flex-grow:1;`}>
        <h3>
      הכנסת אירועים לפי הלוח היהודי
      </h3>
      </div>
      <div>
        <Button onClick={store.clickLogout}>התנתקות </Button>
      </div>
    </div>
    {/* <div>{store.getCurrentCalendar().name}</div> */}
    רשימת תאריכים:
    <Button onClick={showExample}>הצג דוגמא</Button>
    <br/>
    <TextField 
    multiline
    label="רשימת תאריכים"    
    css={`width:100%;`}
    value={draftList} onChange={e=>setDraftList(e.target.value)}/>
    <br/>
    * לא לדאוג אפשר בכל עת לחזור לדף זה ולעדכן את הרשימה. הרשימה נמצאת פה ומחכה לכם להוספת אירועים.
    <br/>
    <Button onClick={clickReset}>איפוס רשימה</Button>
    <br/>
    {!saving && <Button variant="contained" onClick={clickSave}>שמירה</Button>}
    {(  saving) && <span>
      <CircularProgress size={12}/>
      &nbsp;
      הנתונים נשמרים
      </span>}

    
    </div>

}