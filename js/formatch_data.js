import livescore from './api.js'
let f, id, fixture, h2h, standings
window.addEventListener('load', async (e) => {
  await main()
  if (fixture.event_live == '1') {
    setInterval(async () => {
      await main()
    }, 60000)
  }
})

async function main() {
  f = await livescore.getAllFixtures()
  id = Object.fromEntries(
    window.location.href
      .split('?')[1]
      .split('&')
      .map((el) => el.split('='))
  ).id.replace('#', '')
  fixture = livescore.getFixture(id)
  h2h = await livescore.geth2h(fixture.home_team_key, fixture.away_team_key)
  standings = await livescore.gettable(fixture.league_key)
  fn()
}

function fn() {
  let allEvents = [...fixture.cards, ...fixture.goalscorers]
  let events = allEvents.sort(
    (a, b) => Number(eval(String(a.time))) - Number(eval(String(b.time)))
  )

  let home = document.querySelector('.home-team')
  let away = document.querySelector('.away-team')
  let homeScore = document.querySelector('.home-score')
  let awayScore = document.querySelector('.away-score')
  let time = document.querySelector('.scheduled-time')
  let referee = document.querySelector('.referee')
  let venue = document.querySelector('.venue')

  home.textContent = fixture.event_home_team
  away.textContent = fixture.event_away_team
  homeScore.textContent = fixture.event_final_result.split('-')[0] || '?'
  awayScore.textContent = fixture.event_final_result.split('-')[1] || '?'
  time.textContent = fixture.event_time
  referee.textContent = fixture.event_referee
  venue.textContent = fixture.event_stadium
  displayEvents(events)
  displayH2Hs(h2h.H2H)
  displayStandings(standings.total)
  displayStandings(standings.home, '#league-table-home')
  displayStandings(standings.away, '#league-table-away')
}
function displayEvents(events) {
  let eventsContainer = document.querySelector('.allEvents')
  eventsContainer.innerHTML = ''
  for (let event of events) {
    let div = document.createElement('div')
    div.classList.add('match-details-events')
    div.classList.add('black-row')
    div.innerHTML = `
<span class="details-time">${event.time}</span>
<div class="match-players-details">
    <span class="details details-home">
        <span class="details-player">${
          event.score && event.home_scorer
            ? `Goal!!! ${event.home_scorer}`
            : event.card && event.home_fault
            ? `${findImage(event.card)} ${event.home_fault}`
            : ''
        }</span>
    </span>
    <span class = "details">
        <span class="details-center">${
          (event.score && event.score.split(' - ')[0]) || ''
        }</span>
        <span class="dash">${(event.score && '-') || ''}</span>
        <span class="away-score">${
          (event.score && event.score.split(' - ')[1]) || ''
        }</span>
    </span>
    <span class="details details-away">
        <span class="details-player">${
          event.score && event.away_scorer
            ? `Goal!!! ${event.away_scorer}`
            : event.card && event.away_fault
            ? `${findImage(event.card)} ${event.away_fault}`
            : ''
        }</span>
    </span>
</div>
<div class="empty">just empty space</div>
        `
    eventsContainer.appendChild(div)
  }
}
function findImage(card) {
  if (card == 'yellow card') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" name="FootballYellowCard"><rect width="10" height="14" x="2" rx="2" transform="translate(-1.68)" fill="#FFCE00" fill-rule="evenodd"></rect></svg>`
  } else {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" name="FootballRedCard"><rect width="10" height="14" x="2" rx="2" transform="translate(-1.68)" fill="#F00" fill-rule="evenodd"></rect></svg>`
  }
}

function displayH2Hs(h2h) {
  let h2hcont = document.querySelector('#h2h')
  let newh2h = []
  let h2hs = {}
  for (let match of h2h) {
    if (!newh2h.includes(match.league_name)) {
      newh2h.push(match.event_league_name)
      h2hs[match.league_name] = []
    }
    h2hs[match.league_name].push(match)
  }
  for (let [league, matches] of Object.entries(h2hs)) {
    let div = document.createElement('div')
    div.className = 'h2h-match'
    div.innerHTML = `
<div class="h2h-stage-wrapper">
    ${league}
</div>`
    for (let match of matches) {
      let matchn = `
<div class="h2h-match-list">
    <div class="match-list-info">
        <div class="match-list-date">${match.event_date}</div>
        <div>FT</div>
    </div>
    <div class="match-list-teams">
        <div>${match.event_home_team}</div>
        <div>${match.event_away_team}</div>
    </div>
    <div class="match-list-scores">
        <div class="home-score">${match.event_final_result.split('-')[0]}</div>
        <div class="away-score">${match.event_final_result.split('-')[1]}</div>
    </div>
</div>
        `
      div.innerHTML += matchn
    }
    h2hcont.appendChild(div)
  }
}

function displayStandings(table, id = '.league-table-body') {
  let standings_table = document.querySelector(id)
  for (let club of table) {
    let tr = document.createElement('tr')
    tr.className = 'league-row-home'
    tr.innerHTML = `
<td class="league-row-left">${club.standing_place}<span class="rank"></span></td>
<td class="league-row-center" id="league-column-name">${club.standing_team}</td>
<td class="league-row-right" id="league-column-played">${club.standing_P}</td>
<td class="league-row-right" id="league-column-wins">${club.standing_W}</td>
<td class="league-row-right" id="league-column-draws">${club.standing_D}</td>
<td class="league-row-right" id="league-column-losses">${club.standing_L}</td>
<td class="league-row-right" id="league-column-goalsfor">${club.standing_F}</td>
<td
    class="league-row-right"
    id="league-column-goalsagainst"
>${club.standing_A}</td>
<td class="league-row-right" id="league-column-goalsdiff">${club.standing_GD}</td>
<td class="league-row-right" id="league-column-points">${club.standing_PTS}</td>
        `
    standings_table.appendChild(tr)
  }
}
