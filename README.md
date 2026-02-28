# MLB Team Page & Scoreboard

An **interactive MLB Team Page and Scoreboard** web app that fetches real-time data from ESPN’s API. Users can view all MLB teams, select a team to see details, roster, and schedule, and check today’s games with live scores.

---

## Features

1. **MLB Teams Dropdown**
   - Fetches all MLB teams using the ESPN API.
   - Displays team name, abbreviation, and logo in a dropdown.

2. **Team Details**
   - Displays selected team’s:
     - Full name
     - Abbreviation
     - Logo
     - Record (Wins-Losses-Ties)
     - Stadium
   - Shows roster (player names & positions).
   - Shows upcoming schedule (next 5 games).

3. **MLB Scoreboard**
   - Displays today’s games with:
     - Teams playing
     - Current scores
     - Game status (Scheduled, In Progress, Final)
   - Shows team logos alongside scores.
   - Two games per row layout for easy reading.

4. **Responsive & Interactive**
   - Hover effects on scoreboard cards.
   - Works on mobile and desktop.
   - Handles errors and displays loading messages while fetching data.

---

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Async JavaScript with `fetch()` and `Promise.all()`
- ESPN Public API:
  - Teams: `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams`
  - Team Details/Roster/Schedule: `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams/:team`
  - Scoreboard: `https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard`

---

## Prerequisites

- Node.js installed (for `npx`)
- Internet connection (to fetch ESPN API data)

---

## Run Instructions

npx http-server or visit https://zainabs27.github.io/mlb-scoreboard/
