import store from "../store";

export default function MyCalendars(){
  return <div>My celndars
    {store.user.calendars.map(x=>
    <div onClick={()=>store.openCalendar(x.id)} key={x.id}>{x.name}</div>
    )}
    <a onClick={store.clickLogout}>Logout
      </a>
  </div>
}