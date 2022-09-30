let livescore = document.querySelector('.livescore');
livescore.addEventListener('click', (e) => {
    let values = e.target.value;
    let tab = document.getElementById('match-details-tab');
    // console.log(values)
    let infoContent = document.getElementById('info');
    let tableContent= document.getElementById('table');
    let h2hContent= document.getElementById('h2h')
    let infoTab=document.getElementById('infos')
    let tableTab=document.getElementById('tables')
    let h2hTab=document.getElementById('h2hs')

    Array.from(tab.children).forEach(element => {
        if(e.target.id === 'infos'){
            infoContent.style.display ='block';
            tableContent.style.display="none";
            h2hContent.style.display="none";

            infoTab.classList.add("active");
            tableTab.classList.remove("active");
            h2hTab.classList.remove("active");

        } else if(e.target.id==='tables'){
            tableContent.style.display= "block";
            infoContent.style.display ='none';
            h2hContent.style.display="none";

            infoTab.classList.remove("active");
            tableTab.classList.add("active");
            h2hTab.classList.remove("active");

        } else if(e.target.id=== 'h2hs'){
            tableContent.style.display= "none";
            infoContent.style.display ='none';
            h2hContent.style.display="block";

            infoTab.classList.remove("active");
            tableTab.classList.remove("active");
            h2hTab.classList.add("active");
        }
    });
});      
 let matchTableTabs=document.querySelector("#table");
    // document.querySelectorAll(".match")
    let totalTab = document.getElementById('total');
    let homeTab= document.getElementById('home');
    let awayTab= document.getElementById('away');
    let totalScores=document.getElementById('league-table-total')
    let homeScores=document.getElementById('league-table-home')
    let awayScores=document.getElementById('league-table-away')

matchTableTabs.addEventListener('click', (e)=>{
    if (e.target.id === 'total') {
        totalScores.style.display ='table';
        homeScores.style.display="none";
        awayScores.style.display="none";

        totalTab.classList.add("active");
        homeTab.classList.remove("active");
        awayTab.classList.remove("active");

    } else if (e.target.id === 'home') {
        totalScores.style.display ='none';
        homeScores.style.display="table";
        awayScores.style.display="none";

        totalTab.classList.remove("active");
        homeTab.classList.add("active");
        awayTab.classList.remove("active");

    } else if (e.target.id === 'away') {
        totalScores.style.display ='none';
        homeScores.style.display="none";
        awayScores.style.display="table";

        totalTab.classList.remove("active");
        homeTab.classList.remove("active");
        awayTab.classList.add("active");

    }
})