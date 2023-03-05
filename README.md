# I Choose Who v2

A successor to the original I Choose Who app that I made in my coding bootcamp.

## Differences from the Original

The original app was built with an Express API, using handlebars as a template engine for creating the front-end and Sequelize as the ORM for the MySQL Database. This definitely got the job done, but I wanted to showcase the site with a more modern front-end. V2 is rebuilt from the ground up with NextJS, Prisma ORM, Tailwind CSS, and TypeScript. Authentication has switched from express-sessions to Next-Auth as well. I have also chosen to deploy v2 on Railway instead of Heroku, and use a Railway postgreSQL database instead of mySQL.

In addition, the algorithm for creating battle recommendations has been completely rewritten for better performance.

## Functionality

After logging in, users can add any pokemon from Generations I-VII (Gen VIII coming soon!) to their personal Pokédex. Once they do, they can use the battle planner to determine which of their pokemon is best suited for battle based on their typing.


