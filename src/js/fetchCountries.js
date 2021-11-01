export default function fetchCountries(searchQuery) {
  return fetch(`https://restcountries.com/v2/name/${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    });
}
