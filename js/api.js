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
    console.log(league_id,this.fixtures)
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
    let fromDate = this.addDate(`${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,-3)
    let toDate = this.addDate(`${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,3)
    let fixtures = (
      await this.fetchData({ met: 'Fixtures', from: fromDate, to: toDate })
    ).result
    this.fixtures = fixtures
    return fixtures
  }
  async geth2h(id1,id2){
    return (await this.fetchData({met:'H2H',firstTeamId:id1,secondTeamId:id2})).result
  }
  async gettable(id){
    return (await this.fetchData({met:'Standings',leagueId:id})).result
  }
  addDate(date,num){
    let days = [31,28,31,30,31,30,31,31,30,31,30,31]
    let finalDate = (Number(date.split('-')[2]) + num) % days[Number(date.split('-')[1]) - 1]
    if(finalDate <= 0){
      finalDate = days[Number(date.split('-')[1]) - 2] + finalDate
    }
    let finalMonth = finalDate == Number(date.split('-')[2]) + num ? 
                    date.split('-')[1] : num <= 0 ? 
                    Number( date.split('-')[1]) - 1 : 
                    Number( date.split('-')[1]) + 1
    let finalYear = finalMonth > 12 ? Number(date.split('-')[0]) + 1 : date.split('-')[0]
    return `${finalYear}-${`0${finalMonth}`.split('').reverse().slice(0,2).reverse().join('')}-${`0${finalDate}`.split('').reverse().slice(0,2).reverse().join('')}`
  }
}

let livescore = new LivescoresData(key)

export default livescore
