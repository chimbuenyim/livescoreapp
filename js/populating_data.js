import livescore from './api.js'


// this is vision's work. DO NOT TOUCH
let allMatches = [];
let leagueIds = []
let leagues = []
async function getMatches(){
    // let leagues = (await livescore.getLeagues(8)).map(score => score.league_name)
    let leaguesDisplay = ['La Liga', 'Serie A', 'WC Qualification South America']
    let matches = {}
    leagues = (await livescore.getLeagues(8)).map(score => score.league_name)
    for(let league of leaguesDisplay){
        let id = await livescore.leagueId(league)
        let fixture = await livescore.getFixtures(id)
        matches[league] = fixture
        leagueIds[league] = id
        allMatches.push(fixture)
        console.log(allMatches,leagues)
    }
    return matches
}

function populateMatches(matches){
    let loader = document.querySelector('.loader')
    loader.style.display = 'none'
    let display = document.querySelector('.displaySection')
    let leagues = {}
    for(let league in matches){
        if(matches[league].fixtures == []) continue
        let card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML += `
<header class="cardHeader">
<span class="title">
    ${league}</span> 
    <span class="headerDate">FEBRUARY 15</span>
</header>`
        console.log(card)
        for(let _ = 0; _ < 5;_++){
            let fixture = matches[league].fixtures[_]
            if(fixture){
                let div = document.createElement('div')
                div.classList.add('fixture')
                div.innerHTML += `
<span class="time">${fixture.event_time}</span>

<div class="matchFixture">
    <span class="home">${fixture.event_home_team}</span>
    <div class="score">  
        <span class="homeScore">${fixture.event_final_result.split('-')[0] || '?'}</span>
        <span id="dash">-</span>
        <span class="awayScore">${fixture.event_final_result.split('-')[1] || '?'}</span>
    </div>
    <span class="away">${fixture.event_away_team}</span>
                `
                console.log('card')
                card.appendChild(div)
            }
        }
        display.appendChild(card)
    }
}

function getSpecificMatches(date){
    let leaguesDisplay = ['La Liga', 'Serie A', 'WC Qualification South America']
    let matches = {}
    for(let league of leaguesDisplay){
        console.log('fixture')
        let id = leagueIds[league]
        matches[league] = {fixtures: allMatches.filter(match => match.league_key == id),
                          live : allMatches.filter(match => match.league_key == id && match.event_live == "1")}
        matches[league].fixtures = matches[league].fixtures.filter(el => el.event_date == date)
        console.log(id)
    }
    console.log(matches)
    return matches
}

getMatches()
    .then(() => {
        let date = new Date()
        let result = getSpecificMatches('2022-01-'+date.getDate())
        populateMatches(result)
        document.querySelectorAll('.date').forEach(el => {
            el.addEventListener('click', async e => {
                let result = getSpecificMatches('2022-01-'+eval(String(date.getDate()) + e.target.classList[e.target.classList.length - 1]))
                populateMatches(result)
            })
        })
    })


