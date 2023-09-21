const errMsg = (response) =>
  new Error(`Error ${response.status}: ${response.statusText}`);

export const fetchText = (url) =>
  fetch(url).then((response) => {
    if (response.ok) return response.text();
    else throw errMsg(response);
  });

export const fetchJson = (url) =>
  fetch(url).then((response) => {
    if (response.ok) return response.json();
    else throw errMsg(response);
  });

export const sendText = (url, text) =>
  fetch(url, {
    method: 'POST',
    body: text,
  }).then((response) => {
    if (!response.ok) throw errMsg(response);
  });

export const sendJson = (url, obj) =>
  fetch(url, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj, null, 2),
  });

export const deleteFile = (url) =>
  fetch(url, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) throw errMsg(response);
  });
