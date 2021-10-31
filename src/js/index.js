import '../sass/main.scss';
import { debounce } from 'lodash';
import { error, Stack } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import fetchCountries from './fetchCountries';
import countryCard from '../templates/country-card.hbs';
import countriesList from '../templates/countries-list.hbs';

const refs = {
  input: document.querySelector('#input'),
  output: document.querySelector('.country-box'),
};

refs.input.addEventListener('input', debounce(onInput, 500));

function onInput() {
  if (!refs.input.value) return markupOutput(0);

  fetchCountries(refs.input.value).then(data => {
    if (!data.length) {
      markupOutput(0);
      return errMsg('There is no such country. Refine your request.');
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
    if (markup) return (refs.output.innerHTML = markup);
    return (refs.output.innerHTML = '');
  }

  function errMsg(message) {
    const myStack = new Stack({
      dir1: 'right',
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
      addClass: 'error-box',
    });
  }
}
