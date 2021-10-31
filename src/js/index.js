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
    return onInput();
  }
  return;
});

function onInput() {
  if (!refs.input.value) return markupOutput(0);

  fetchCountries(refs.input.value).then(data => {
    if (!data.length) {
      markupOutput(0);
      return errMsg('Такой страны не существует. Уточните свой запрос!');
    }

    if (data.length > 10) {
      errMsg('Найдено слишком много совпадений. Пожалуйста, введите более конкретный запрос!');
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
      refs.output.style.display = 'block';
    } else {
      refs.output.style.display = 'none';
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
