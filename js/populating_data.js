import livescore from './api.js'
import allLeaguesTotally from './index.js'


// this is vision's work. DO NOT TOUCH
let allMatches = [];
let leagueIds = []
let allf = []
let country,league,curday
let allleagues = []
async function getMatches(){
    // let leagues = (await livescore.getLeagues(8)).map(score => score.league_name)
    let leaguesDisplay = allLeaguesTotally.slice(0,10)
    let matches = {}
    allf = await livescore.getAllFixtures()
    allleagues = await livescore.getAllLeagues()
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
    <span class="headerDate"></span>
</header>`
        console.log(card)
        for(let _ = 0; _ < 5;_++){
            let fixture = matches[league][_]
            if(fixture){
                let a = document.createElement('a')
                let div = document.createElement('div')
                a.href = '/livescoreapp/matchdata.html?id=' + fixture.event_key
                a.appendChild(div)
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
</div>

<span class="time" style='width:150px'>${fixture.event_date}</span>

                `
                
                console.log('card')
                card.appendChild(a)
                a.style.color = 'white'
                a.style.textDecoration = 'none'
            }
        }
        display.appendChild(card)
    }
}

function getSpecificMatches(date,country,curleague,islive=false){
    let leaguesDisplay = !islive ? allLeaguesTotally.slice(0,10) : allLeaguesTotally
    let matches = {}
    let idx = 0
    console.log(allf)
    let valid = allf
    if(country != null){
        leaguesDisplay = []
        valid = allf.filter(f => f.country_name == country)
        valid.forEach(f => {
            if(!leaguesDisplay.includes(f.league_name)){
                leaguesDisplay.push(f.league_name)
            }
        })
    
    }else if(curleague != null){
        valid = allf.filter(f => f.league_name == curleague)
        console.log(valid);
        leaguesDisplay = []
        if(valid[0]){
            leaguesDisplay.push(valid[0].league_name)
        }
    }
    for(let league of leaguesDisplay){
        let validM = valid.filter(match => match.event_date == String(date) && match.league_name == league)
        matches[league] = validM
        idx += 1
    }
    console.log(matches)
    return matches
}

function getAllMatches(){
    let leaguesDisplay = allLeaguesTotally.slice(0,10)
    let matches = {}
    let idx = 0
    for(let league of leaguesDisplay){
        let id = leagueIds[league]
        matches[league] = allMatches[idx]
        idx += 1
    }
    console.log(matches)
    return matches
}


window.addEventListener('load', e => {
    let idx = -3
    document.querySelectorAll('.clickable').forEach(el => {
        el.textContent = plus('Jan '+ new Date().getDate(),idx)
        if(Array.from(el.classList).includes('today')){
            el.textContent = 'Today'
        }
        idx += 1
    })
})


getMatches()
    .then(() => {
        let live = document.querySelectorAll('.live')
        let home = document.querySelectorAll('.home')
        let countries = document.querySelectorAll('.country')
        let leagues = document.querySelectorAll('.league')
        live.forEach(el =>el.addEventListener('click',e => {
            let result = getSpecificMatches('2022-01-'+ new Date().getDate(),null,null,true)
            let nresult = {}
            for(let [league,matches] of Object.entries(result)){
                let match = matches.filter(el => el.event_live == "1")
                nresult[league] = match
            }
            populateMatches(nresult)
        }))
        home.forEach(el => el.addEventListener('click',e => {
            let result = getAllMatches()
            populateMatches(result)
        }))
        countries.forEach(el => {
            el.addEventListener('click',e => {
                country = e.target.textContent
                league = null
                let result = getSpecificMatches(curday,country,league)
                populateMatches(result)
            })
        })
        leagues.forEach(el => {
            el.addEventListener('click',e => {
                league = e.target.textContent
                country = null
                let result = getSpecificMatches(curday,country,league)
                populateMatches(result)
            })
        })
        let date = new Date()
        let result = getSpecificMatches('2022-01-'+date.getDate())
        populateMatches(result)
        document.querySelectorAll('.clickable').forEach(el => {
            el.addEventListener('click', async e => {
                console.log(e.target.classList)
                let day = eval(date.getDate() + e.target.classList[e.target.classList.length - 1].split('val')[1])
                curday = '2022-01-'+day
                let result = getSpecificMatches('2022-01-'+ day,country,league)
                populateMatches(result)
            })
        })
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
