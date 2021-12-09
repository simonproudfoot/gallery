

export function ajax(options) {

    fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
      topLevelAwait: true
    }).then(function (response) {
      response.json().then(function (json) {
        resolve(json);
      }).catch(err => reject(err));
    }).catch(err => reject(err));
  
}
