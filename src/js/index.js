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
  country: document.querySelector('.country-box'),
};

refs.input.addEventListener('input', debounce(onInput, 500));
refs.country.addEventListener('click', e => {
  if (e.target.className === 'name-country') {
    refs.input.value = e.target.innerText;
    refs.output.classList.remove('show-js');
    setTimeout(() => onInput(), 250);
  }
  return;
});

function onInput() {
  if (!refs.input.value) return markupOutput(0);

  if (!refs.input.value.match(/^[a-zA-Z, ]*$/)) {
    markupOutput(0);
    return errMsg('Используйте только латинские буквы!');
  }

  fetchCountries(refs.input.value).then(data => {
    if (!data.length) {
      markupOutput(0);
      return errMsg(`Страна с названием "${refs.input.value}" не найдена. Уточните запрос!`);
    }

    if (data.length > 10) {
      markupOutput(0);
      errMsg(`Найдено ${data.length} совпадений. Введите более конкретный запрос!`);
    } else if (data.length > 2 && data.length <= 10) {
      markupOutput(countriesList(data));
    } else {
      markupOutput(countryCard(data[0]));
    }
    return;
  });

  function markupOutput(markup) {
    if (markup) {
      refs.output.innerHTML = markup;
      refs.output.classList.add('show-js');
    } else {
      refs.output.classList.remove('show-js');
      return (refs.output.innerHTML = '');
    }
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
      delay: 2000,
      closer: false,
      stack: myStack,
      title: 'ОШИБКА!',
      icon: false,
      width: '250px',
      sticker: false,
      addClass: 'error-box',
    });
  }
}
