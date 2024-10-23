**News Dating** is a web application that aggregates RSS feeds from multiple providers, allowing users to subscribe to their favorite categories and easily access the latest articles. The project is designed to offer a personalized news experience, with support for different languages and providers.


## Key Features

 - **Custom RSS Feed Integration**: Users can subscribe to various categories, each linked to specific RSS feeds. Providers are stored in a relational database and can be dynamically queried based on user preferences.
 - **Bionic Reading**: This app integrate the [Bionic Reading](https://www.oxfordlearning.com/what-is-bionic-reading-and-why-should-you-use-it/) algorithm to help you read more faster. It can be toggle ans is applied to all of the news contents.
 - **User Subscriptions**: Each user can manage their own set of subscriptions, stored in a database and easily updatable from the UI. The application tracks their preferences and delivers content tailored to their interests.
 - **Optimized for Performance**: The frontend uses SvelteKit, known for its fast performance and simple reactivity model. The application dynamically fetches and parses RSS feeds, displaying the results in a structured and visually appealing format using TailwindCSS for styling.
 - **Dynamic Content Parsing**: RSS data is fetched from external sources, and since each provider may use different selectors, the project stores selector rules in a database and applies them as needed to extract titles, descriptions, and images.


## Technical Details

 - **Frontend**: Built with SvelteKit and TailwindCSS for a responsive, fast, and modern user interface.
 - **Backend**: The backend is a Node.js server that acts as a proxy for fetching RSS feeds. It also communicates with a MySQL database to store provider selectors, user preferences, and categories.
 - **Database**: The MySQL database schema includes tables for users, categories, user subscriptions, and provider selectors, which allow for flexible and dynamic querying.
 - **Transitions and Animations**: Using Svelte’s built-in transitions, the UI is enhanced with smooth animations for category selection, filtering, and subscribing to news feeds.
 - **Modular Design**: The project follows a component-based architecture, allowing for reusable, maintainable code, especially with complex components like the category selector.
