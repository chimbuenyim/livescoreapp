import { default as api_key } from './config.js'

async function fetchData() {
  var myHeaders = new Headers()

  let criteria = 'Fixtures'
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
    // mode: 'no-cors',
  }

  fetch(
    `https://apiv2.allsportsapi.com/football/?met=${criteria}&APIkey=${api_key}&from=2022-01-25&to=2022-01-27`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error))
}

export default fetchData()

// function country() {
//   return fetchData('Countries')
// }
