import 'whatwg-fetch';
import moment from 'moment';
import util from './util';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(function() {
    console.log('Service Worker Registered');
  });
}

const api = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=50';
const lsit = util.el('list');
const hasCaches = 'caches' in window;

function makeHnListItem(data) {
  return `
    <article class="List__item Item">
      <h1 class="Item__title">
        <a href="${ data.url }" target="_blank">${ data.title }</a>
      </h1>
      <ul class="Item__infos Infos">
        <li class="Infos__item">${ data.points } points</li>
        <li class="Infos__item">by ${ data.author }</li>
        <li class="Infos__item">${ data.num_comments } comments</li>
        <li class="Infos__item">${ data.created_at }</li>
      </ul>
    </article>
  `;
}

function makeHnListFromCache() {
  if (!hasCaches) return;

  caches.match(api).then((response) => {
    if (!response) return;

    response.json().then((json) => {
      json.hits.forEach((item) => {
        list.insertAdjacentHTML('beforeend', makeHnListItem(item));
      });
    });
  });
}

function makeHnList() {
  makeHnListFromCache();

  fetch(api).then((response) => {
    return response.json()
  }).then((json) => {
    console.log(json.hits);
    json.hits.forEach((item) => {
      list.insertAdjacentHTML('beforeend', makeHnListItem(item));
    })
  }).catch((ex) => {
    console.log('parsing failed', ex)
  });
}

makeHnList();
