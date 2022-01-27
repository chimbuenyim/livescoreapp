import { default as key } from './config.js'

class LivescoresData {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.apiUrl = 'https://apiv2.allsportsapi.com/football/'
  }
  async fetchData(criteria) {
    let query = ''
    for (let [key, param] of Object.entries(criteria)) {
      query += `&${key}=${param}`
    }
    let result = await fetch(`${this.apiUrl}?APIkey=${this.apiKey}` + query)
    return result.json()
  }
  async getCountries() {
    return (await this.fetchData({ met: 'Countries' })).result
  }
  async getLeagues(country_key) {
    let leagues = (await this.fetchData({ met: 'Leagues' })).result
    let toReturn = leagues
      .filter((league) => {
        return league.country_key == country_key
      })
      .map(({ league_name, country_name, league_key }) => {
        return { league_name, country_name, league_key }
      })
    return toReturn
  }
  async getFixtures(league_id) {
    let time = new Date()
    let fromDate = '2022-01-' + (time.getDay() - 7)
    let toDate = '2022-01-' + (time.getDay() + 7)
    let fixtures = (
      await this.fetchData({ met: 'Fixtures', from: fromDate, to: toDate })
    ).result
    let live = []
    fixtures = fixtures.filter((fixture) => {
      return fixture.league_key == league_id
    })
    live = fixtures.filter((fixture) => {
      return fixture.league_key == league_id && fixture.event_live == '1'
    })
    return { fixtures: fixtures, live: live }
  }
  async getAllFixtures() {
    let time = new Date()
    let fromDate = '2022-01-' + (time.getDay() - 3)
    let toDate = '2022-01-' + (time.getDay() + 3)
    let fixtures = (
      await this.fetchData({ met: 'Fixtures', from: fromDate, to: toDate })
    ).result
    return fixtures
  }
}

let livescore = new LivescoresData(key)

export default livescore
