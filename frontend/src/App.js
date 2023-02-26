import React from 'react';
import { useEffect } from "react";
import Home from "./pages/home";
import MyCalendars from "./pages/my-calendars";
import store from "./store";
import ShowCalendar from './pages/one-calendar';
import myAxios from './myAxios';
import { Button, Card, LinearProgress } from '@mui/material';
var querystring = require('querystring');

import RTL from './rtl';

export function App() {
  store.useRerenderIfChange(() => [store.page, store.user]);
  async function getUserFromLocalStorage() {
    store.page="waiting-for-load"
    store.updateStore();
    var auth = localStorage.auth;
    if (auth) {
      var res = await myAxios()('https://api-ivri.boti.bot/user?auth=' + auth);
      store.user = await res.data;
      store.calendarId=store.user.calendars[0].id
      store.page = "one-calendar";
      store.updateStore();
    } else {
      store.page=''
      store.updateStore()
    }
  }

  useEffect(() => {
    var qs = querystring.parse(window.location.hash.slice(1));
    if (qs.auth) {
      localStorage.auth = qs.auth;
      delete qs.auth;
      window.location.href = window.location.pathname + '#' + querystring.stringify(qs);
      getUserFromLocalStorage();
    } else {
      getUserFromLocalStorage();
    }
  }, []);
  return (
      <RTL>
    <div css={`direction:rtl;margin-left:auto;margin-right:auto;padding-top:20px;max-width:800px;`}>
    <Card>
      <div css={`padding:10px;`}>
        {store.page=="waiting-for-load" && <div><br/><LinearProgress/><br/></div>}
        {store.page == '' && <Home />}
        {store.page == 'my-calendars' && <MyCalendars />}
        {store.page == 'one-calendar' && <ShowCalendar />}
      </div>
    </Card>
    <br/>
    <Card>
    <div css={`padding:10px;`}>
      <h3>עזרה תמיכה וקהילה</h3>
      <div>
        השירות הוא ללא תשלום, ונוצר באהבה ללוח העברי שלנו. תהנו!
        <br/>
    רוצים לדעת עדכונים לשירות? יש לכם שאלות הצעות ורעיונות?
    <br/>
    <Button onClick={()=>window.open('https://chat.whatsapp.com/HUjmJ24L0AgCDCclPyVjkD')}>הצטרפות לקבוצת החדשות  - מנהלים בלבד מפרסמים</Button>
    <br/>
    <Button onClick={()=>window.open('https://chat.whatsapp.com/IDkUybkQL4zBsH6T8Oz13a')}>הצטרפות לקבוצת הקהילה לשאלות עזרה תמיכה והצעות</Button>
      <br/>
    </div>
    </div>
    </Card>
    </div>
    </RTL>
  );
}



