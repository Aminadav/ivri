import { Button, Card } from "@mui/material"

export default function Home(){
  async function clickLogin(){
    var res=await (await fetch('https://api-ivri.boti.bot/is-web-view',{method:'post'})).json()
    var isWebView=res?.isWebView
    if(isWebView) {
      alert('מטעמי בטיחות, לא ניתן להתחבר דרף דפדפן זה. עליך לפתוח את הדף בספארי או בכרום. אפשר גם בפיירפוקס')
      return
    }
    window.open('https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code&client_id=108778709679-mvnp8sesar8f16o0a99t88ptjbjkbba3.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.app.created&redirect_uri=https://api-ivri.boti.bot/callback_oauth&state=' + encodeURIComponent(window.location.origin + window.location.pathname),'_top')
  }
  return <div>
    <center>
      <h2>
   הוספת אירועים שנתיים ללוח השנה של גוגל לפי לוח השנה היהודי
   </h2>
   <br/>
   <Button
   size="large"
   variant="contained"
    onClick={clickLogin}
    >התחברות עם Google</Button>
    <br/>
    לאחר התחברות יומן חדש יווצר אצלך ושם תוכלו לראות את האירועים שבלוח העברי.
    <br/><br/>
    <b>חייבים לסמן שאתם נותנים הרשאה ליצור אירועים חדשים ביומן שלכם.</b>
    <br/>
    לשמירה על פרטיותך, השירות אינו דורש גישה לצפייה באירועים של היומן שלכם בגוגל רק יצירת אירועים חדשים.<br/>
    <br/>
    </center>
    </div>
}