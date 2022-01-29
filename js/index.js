import livescore from './api.js'

let categoryContainer = document.querySelector('.catergoryContainer')

const allLeaguesTotally = []

livescore.getAllLeagues()
  .then(data => {
    livescore
    .getCountries()
    .then((result) => {
      result.forEach((element) => {
        let { country_key, country_logo, country_name } = element
  
        let newDetails = document.createElement('details')
        let newSumamary = document.createElement('summary')
        newSumamary.classList.add('category', 'country')
        newSumamary.innerText = country_name
        newSumamary.id = country_key
        newDetails.appendChild(newSumamary)
  
        let legs = getLeagues(country_key,data)
        legs.forEach((elem) => {
          let { league_name, league_key } = elem
          let newLi = document.createElement('li')

          newLi.id = league_key
          newLi.innerText = league_name
          newLi.classList.add('subcategory', 'league')
          newDetails.appendChild(newLi)
          allLeaguesTotally.push(league_name)

          newLi.addEventListener('click', (e) => {
            console.log(e.target.id)
          })
        })
  
        categoryContainer.appendChild(newDetails)
      })
    })
    .catch((err) => {
      throw console.error()
    })
  })


function getLeagues(key,data){
  return data.filter(league => league.country_key == key)
}

export default allLeaguesTotally