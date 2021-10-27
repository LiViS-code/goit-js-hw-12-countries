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

ref.input.addEventListener('input', debounce(onInput, 1000));

function onInput() {
  if (!ref.input.value) {
    ref.output.innerHTML = '';
    return;
  }

  fetchCountries(ref.input.value).then(data => {
    const myStack = new Stack({
      dir1: 'up',
    });

    if (!data.length) {
      ref.output.innerHTML = '';

      error({
        text: 'There is no such country. Refine your request.',
        delay: 5000,
        closer: false,
        stack: myStack,
        title: 'Eror!',
        icon: false,
        width: '250px',
        sticker: false,
      });
      return;
    }

    if (data.length > 10) {
      error({
        text: 'Too many matches found. Please enter amore specific query!',
        delay: 5000,
        closer: false,
        stack: myStack,
        title: 'Eror!',
        icon: false,
        width: '250px',
        sticker: false,
      });
    } else if (data.length > 2 && data.length <= 10) {
      ref.output.innerHTML = '';
      ref.output.insertAdjacentHTML('afterbegin', countriesList(data));
    } else {
      ref.output.innerHTML = '';
      ref.output.insertAdjacentHTML('afterbegin', countryCard(data[0]));
    }
    return;
  });
}
