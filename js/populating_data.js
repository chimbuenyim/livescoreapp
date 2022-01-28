import livescore from './api.js'


// this is vision's work. DO NOT TOUCH
let allMatches = [];
let leagueIds = []
async function getMatches(){
    // let leagues = (await livescore.getLeagues(8)).map(score => score.league_name)
    let leaguesDisplay = ['La Liga', 'Serie A', 'WC Qualification South America']
    let matches = {}
    let allf = await livescore.getAllFixtures()
    await livescore.getLeagues(8)
    for(let league of leaguesDisplay){
        let id = livescore.leagueId(league)
        let fixture = livescore.getFixtures(String(id))
        matches[league] = fixture
        leagueIds[league] = id
        allMatches.push(fixture)
    }
    return matches
}

function populateMatches(matches){
    let loader = document.querySelector('.loader')
    loader.style.display = 'none'
    let display = document.querySelector('.container')
    let leagues = {}
    display.innerHTML = ''
    for(let league in matches){
        if(matches[league].length == 0) continue
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
            let fixture = matches[league][_]
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
    let idx = 0
    let min = leaguesDisplay[0]
    let minidx = 0
    for(let league of leaguesDisplay){
        let id = leagueIds[league]
        matches[league] = allMatches[idx].filter(match => match.event_date == String(date))
        idx += 1
    }
    console.log(matches)
    return matches
}


window.addEventListener('load', e => {
    let idx = -3
    document.querySelectorAll('.clickable').forEach(el => {
        el.textContent = plus('Jan '+ new Date().getDate(),idx)
        idx += 1
    })
})

getMatches()
    .then(() => {
        document.querySelectorAll('.clickable').forEach(el => {
            el.addEventListener('click', async e => {
                console.log(e.target.classList)
                let day = eval(date.getDate() + e.target.classList[e.target.classList.length - 1].split('val')[1])
                let result = getSpecificMatches('2022-01-'+ day)
                populateMatches(result)
            })
        })
        let date = new Date()
        let result = getSpecificMatches('2022-01-'+date.getDate())
        populateMatches(result)
    })


function plus(date,num){
    let datesMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    let dates = {'Jan':31,'Feb':28,'Mar':31,'Apr':30,'May':31,'Jun':30,'Jul':31,'Aug':31,'Sep':30,'Oct':31,'Nov':30,'Dec':31}
    let dateMonth = date.split(' ')[0]
    let dateDay = Number(date.split(' ')[1])
    let newDate = ''
    dateDay += num
    if(dateDay > dates[dateMonth]){
        newDate = datesMonths[datesMonths.indexOf(dateMonth) + 1] + ' ' + dateDay % dates[dateMonth]
    }else{
        newDate = dateMonth + ' ' + dateDay
    }
    return newDate
}

function getMatcheswithCountry(country){

}