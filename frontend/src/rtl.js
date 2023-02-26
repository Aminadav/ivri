import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});


const theme = createTheme({
  direction: 'rtl',
});

export default function RTL(props) {
  return  <ThemeProvider theme={theme}>
    <CacheProvider value={cacheRtl}>{props.children}</CacheProvider>;
    </ThemeProvider>
}
