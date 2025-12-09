Design Choices

I used React for the frontend because it makes building interactive dashboards easy, and Tailwind CSS helped me quickly create a clean, modern interface. The backend uses Node.js + Express, which provides a simple structure for building REST APIs. I chose PostgreSQL to store user accounts and investments because it handles relational data well. The database schema uses two tables—users and investments—linked by a foreign key so each user has their own portfolio.

Challenges

Some challenges included integrating the Finnhub API for live stock and crypto prices, especially converting symbols like “BTC” into the correct API format. Setting up Google OAuth was also tricky because I had to configure sessions and make sure routes only returned data for the logged in user. On the frontend, managing modals for editing and deleting investments taught me a lot about React state and UI flow.

Learning Outcomes

I learned how a fullstack application works endtoend: building REST routes, connecting Express to PostgreSQL, handling authentication, and updating UI state based on API responses. I also gained experience with real API integration, data validation, and building clean dashboards using charts.

Future Work

With more time, I would deploy the full app online, add a watchlist, store historical performance, send price-change alerts, and improve mobile responsiveness.
