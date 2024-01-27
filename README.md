# I Choose Who v2

A successor to the original [I Choose Who](https://github.com/mdbow22/I-Choose-Who) app that I made in my coding bootcamp. Create a personal collection of pokemon you have in your games. Then go to the Battle Planner, select the pokemon you're going up against, and I-Choose-Who will determine the best pokemon in your collection for the job.

## Differences from the Original

Original App was built on the following:
- Express API
- Handlebars template engine
- Sequelize ORM
- MySQL Database
- Bulma CSS

V2 is now built with the following:
- NextJS
- TailwindCSS
- TypeScript
- PostgreSQL

Other changes include a switch from express-sessions for authentication to Next-Auth, deployment to Railway instead of Heroku, and an overhaul of the algorithm used in the Battle Planner.

## Functionality

After logging in, users can add any pokemon from Generations I-VII (Gen VIII coming soon!) to their personal Pokédex. Once they do, they can use the battle planner to determine which of their pokemon is best suited for battle based on their typing.


## Demo Site

You can access the demo site here: [i-choose-who.up.railway.app](https://i-choose-who.up.railway.app)

An email is required to access and the use the site but this is only stored on the server for the app and is not used for any analytics.