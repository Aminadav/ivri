const { newStore } = require("./store-creator");

var store=newStore({
  user:{},
  page:'',
  calendarId:null,
  openCalendar:calendarId=>{
    store.page='one-calendar'
    store.calendarId=calendarId
    store.updateStore()
  },
  navigate:(url)=>{
    store.page=url
    store.updateStore()
  },
  clickLogout:()=>{
    delete localStorage.auth
    store.user={}
    store.page=''
    store.updateStore()
  },
  getCurrentCalendar:()=>{
    return store.user.calendars?.find(x=>x.id==store.calendarId)
  }
})
window.store=store
export default store