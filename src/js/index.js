import 'whatwg-fetch';
import 'babel-polyfill';
import moment from 'moment';
import util from './util';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('Service Worker Registered');
  });
}

const makeHnListItem = (item) => {
  return `
    <article class="List__item Item">
      <h1 class="Item__title">
        <a href="${ item.url }" target="_blank">${ item.title }</a>
      </h1>
      <ul class="Item__infos Infos">
        <li class="Infos__item">${ item.points } points</li>
        <li class="Infos__item">by ${ item.author }</li>
        <li class="Infos__item">${ item.num_comments } comments</li>
        <li class="Infos__item">${ moment(item.created_at, 'YYYYMMDD').fromNow() }</li>
      </ul>
    </article>
  `;
}

const makeHnList = async (list, url) => {
  const response = await fetch(url).catch((ex) => console.log('parsing failed', ex));
  const json = await response.json();

  json.hits.forEach((item) => {
    list.insertAdjacentHTML('beforeend', makeHnListItem(item));
  });
}

const list = util.el('list');
const REQ_URL = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=50';

makeHnList(list, REQ_URL);
