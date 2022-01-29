import livescore from './api.js'

let categoryContainer = document.querySelector('.catergoryContainer')

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

      livescore.getLeagues(country_key).then((legs) => {
        legs.forEach((elem) => {
          let { league_name, league_id } = elem
          let newLi = document.createElement('li')

          newLi.id = league_id
          newLi.innerText = league_name
          newLi.classList.add('subcategory', 'league')
          newDetails.appendChild(newLi)

          newLi.addEventListener('click', (e) => {
            console.log(e.target.id)
          })
        })
      })

      categoryContainer.appendChild(newDetails)
    })
  })
  .catch((err) => {
    throw console.error()
  })
