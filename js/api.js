import { default as key } from './config.js'

class LivescoresData {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.apiUrl = 'https://apiv2.allsportsapi.com/football/'
    this.leagues = []
    this.fixtures = []
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
    this.leagues = leagues
    let toReturn = leagues
      .filter((league) => {
        return league.country_key == country_key
      })
      .map(({ league_name, country_name, league_key }) => {
        return { league_name, country_name, league_key }
      })
    return toReturn
  }
  async getAllLeagues(){
    return (await this.fetchData({ met: 'Leagues' })).result
  }
  getFixtures(league_id) {
    let fixtures = this.fixtures.filter((fixture) => {
      return fixture.league_key == league_id
    })
    return fixtures
  }
  getFixture(fixture_id){
    let fixture = this.fixtures.filter(fixture => fixture.event_key == fixture_id)
    return fixture[0]
  }
  leagueId(league_name){
    return this.leagues.filter((league) => {
        return league.league_name == league_name
      })[0].league_key
  }
  async getAllFixtures() {
    let time = new Date()
    let fromDate = '2022-01-' + (time.getDate() - 3)
    let toDate = '2022-02-' + ((time.getDate() + 3)%31)
    let fixtures = (
      await this.fetchData({ met: 'Fixtures', from: fromDate, to: toDate })
    ).result
    console.log(fixtures)
    this.fixtures = fixtures
    return fixtures
  }
  async geth2h(id1,id2){
    return (await this.fetchData({met:'H2H',firstTeamId:id1,secondTeamId:id2})).result
  }
  async gettable(id){
    return (await this.fetchData({met:'Standings',leagueId:id})).result
  }
}

let livescore = new LivescoresData(key)

export default livescore
