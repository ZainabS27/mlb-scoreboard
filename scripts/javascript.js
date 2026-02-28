const API_TEAMS = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams";
const loadingMessage = document.getElementById("loading-message");
const errorMessage = document.getElementById("error-message");
const teamSelect = document.getElementById("team-select");
const teamNameDisplay = document.getElementById("team-name");
const teamLogoDisplay = document.getElementById("team-logo");
const teamAbbreviationDisplay = document.getElementById("team-abbreviation");

const teamRecordDisplay = document.getElementById("team-record");
const teamStadiumDisplay = document.getElementById("team-stadium");
const rosterList = document.getElementById("roster-list");
const scheduleList = document.getElementById("schedule-list");

const scoreboardDisplay = document.getElementById("scoreboard-container");

// fetch all
async function fetchTeams(){
    try{
        loadingMessage.textContent = "Loading teams...";
        const response = await fetch(API_TEAMS)
        if(!response.ok){
            throw new Error(`Failed to fetch teams`);
        }
        const data = await response.json();

        // array of teams
        return data.sports[0].leagues[0].teams;
    } catch(error){
        errorMessage.textContent = error.message;
        return [];
    } finally{
        loadingMessage.style.display = "none";
    }
}

// populate dropdown
function populateTeamDropdown(teams){
    teams.forEach(teamObj => {
        const team = teamObj.team;
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = team.displayName;
        teamSelect.appendChild(option);
    });
}

// fetch team data
async function fetchTeamData(teamId){
    try{
        loadingMessage.textContent = "Loading team data...";
        errorMessage.textContext = "";

        const [detailsRes, rosterRes, scheduleRes] = await Promise.all([
            fetch(`${API_TEAMS}/${teamId}`),
            fetch(`${API_TEAMS}/${teamId}/roster`),
            fetch(`${API_TEAMS}/${teamId}/schedule`)
        ]);

        if(!detailsRes.ok || !rosterRes.ok || !scheduleRes.ok){
            throw new Error("Failed to fetch team information");
        }

        const details = await detailsRes.json();
        const roster = await rosterRes.json();
        const schedule = await scheduleRes.json();

        renderTeam(details);
        renderRoster(roster);
        renderSchedule(schedule);
    } catch(error){
        errorMessage.textContext = error.message;
    } finally{
        loadingMessage.textContext = "";
    }
}

// fetch scoreboard
async function fetchScoreboard(){
    try{
        loadingMessage.textContent = "Loading scoreboard...";
        errorMessage.textContext = "";

        const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard");
        if(!response.ok){
            throw new Error(`Failed to fetch scoreboard`);
        }
        const data = await response.json();
        renderScoreboard(data);
    }catch(error){
        errorMessage.textContent = error.message;
    }finally{
        loadingMessage.textContext = "";
    }
}

// render teams information
function renderTeam(details){
    const team = details.team;
    teamNameDisplay.textContent = team.displayName;
    teamAbbreviationDisplay.textContent = `Abbreviation: ${team.abbreviation}`;

    // first logo whose rel array is full and default for standard logo
    const logoObj = team.logos.find(l => l.rel.includes('full') && l.rel.includes('default'));
    teamLogoDisplay.src = logoObj ? logoObj.href : '';
    teamLogoDisplay.alt = `${team.displayName} Logo`;

    const record = details.team.record?.items?.[0]?.summary || "Record not available";
    teamRecordDisplay.textContent = `Record: ${record}`;

    const stadium =
        details.franchise?.venue?.fullName ||
        details.team?.franchise?.venue?.fullName ||
        details.team?.venue?.fullName ||
        "Stadium not available";

    teamStadiumDisplay.textContent = `Stadium: ${stadium}`;
}

function renderRoster(roster){
    rosterList.innerHTML = "";

    roster.athletes?.forEach(group => {
        group.items.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.fullName} - ${player.position?.name || ''}`;
        rosterList.appendChild(li);
        });
    });
}

function renderSchedule(schedule){
    scheduleList.innerHTML = "";

    const games = schedule.events?.slice(0, 5) || [];

    games.forEach(game => {
        const li = document.createElement('li');
        const opponent = game.name;
        const date = new Date(game.date).toLocaleDateString();
        li.textContent = `${date} - ${opponent}`;
        scheduleList.appendChild(li);
    });
}

// render scoreboard    
function renderScoreboard(data){
    scoreboardDisplay.innerHTML = "";
    const games = data.events;

    // for each game, determine home and away teams, scores, add them to score-card
    games.forEach(game => {
        const homeTeam = game.competitions[0].competitors.find(
            team => team.homeAway === "home"
        );

        const awayTeam = game.competitions[0].competitors.find(
            team => team.homeAway === "away"
        );
        const status = game.status.type.description;
        const homeScore = homeTeam.score;
        const awayScore = awayTeam.score;
        const card  = document.createElement("div");

        card.classList.add("score-card");
        card.innerHTML = `
            <h3>${awayTeam.team.displayName} @ ${homeTeam.team.displayName}</h3>
            <p>${awayTeam.team.abbreviation}: ${awayScore}</p>
            <p>${homeTeam.team.abbreviation}: ${homeScore}</p>
            <p class="score-status">${status}</p>
        `;

        scoreboardDisplay.appendChild(card);
    });
}

// event listener for team selection
teamSelect.addEventListener('change', async(e) => {
    const teamId = e.target.value;
    if(!teamId) return;
    fetchTeamData(teamId);

    // refresh every 30 seconds 
    setInterval(fetchScoreboard, 30000);
});

// init
async function init(){
    const teams = await fetchTeams();
    populateTeamDropdown(teams);
    fetchScoreboard();
}

init();