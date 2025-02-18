//@ts-check
function nodeFetch(url, options = {}) {
  console.log('nodeFetch', url, options)
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const protocol = parsedUrl.protocol === 'https:' ? require('https') : require('http');
    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          });
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${err.message}`));
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function addName(email,list_id,name,full_name,userAgent) {
  console.log('addName', {email, list_id, name,full_name})
  await nodeFetch(`https://mailer.boti.bot/api/join?email=${email}&list_id=${list_id}&name=${encodeURIComponent(name)}&user_agent=${encodeURIComponent(userAgent)}&full_name=${encodeURIComponent(full_name)}`).then(console.log).catch(console.log)
}
module.exports.nodeFetch = nodeFetch;
module.exports.addName = addName;