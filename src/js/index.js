import '../sass/main.scss';
import { debounce } from 'lodash';
import { error, Stack } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import fetchCountries from './fetchCountries';
import countryCard from '../templates/country-card.hbs';
import countriesList from '../templates/countries-list.hbs';

const ref = {
  input: document.querySelector('#input'),
  output: document.querySelector('.country-box'),
};

ref.input.addEventListener('input', debounce(onInput, 500));

function onInput() {
  if (!ref.input.value) return markupOutput(0);

  fetchCountries(ref.input.value).then(data => {
    if (!data.length) {
      markupOutput(0);
      errMsg('There is no such country. Refine your request.');
      return;
    }

    if (data.length > 10) {
      errMsg('Too many matches found. Please enter amore specific query!');
    } else if (data.length > 2 && data.length <= 10) {
      markupOutput(countriesList(data));
    } else {
      markupOutput(countryCard(data[0]));
    }
    return;
  });

  function markupOutput(markup) {
    ref.output.innerHTML = '';
    if (markup) ref.output.insertAdjacentHTML('afterbegin', markup);
    return;
  }

  function errMsg(message) {
    const myStack = new Stack({
      dir1: 'up',
      firstpos1: 25,
      push: 'top',
      modal: true,
    });

    return error({
      text: message,
      delay: 3000,
      closer: false,
      stack: myStack,
      title: 'ERROR!',
      icon: false,
      width: '250px',
      sticker: false,
    });
  }
}
