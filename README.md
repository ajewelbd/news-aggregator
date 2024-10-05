# news-aggregator

A program that acts as a news aggregator.

## Run in local machine

-   Ensure you have PostgreSql installed.
-   Open terminal and run the command to copy the env file from example.

```sh
cp .env.example .env
```

-   Open `.env` file.
-   Set environment variable like this:

```js
APP_NAME=News-Aggregator
# Server
HOST=localhost
PORT=3000

# PostgreSQL connection settings
DB_USER=postgres
DB_HOST=localhost
DB_NAME=news_aggregator
DB_PASS=jewel
DB_PORT=5432

API_VERSION=v1
DEFAULT_ARTICLE_FETCH_SCHEDULE = "0 0 * * 0"
```

-   To install the dependency execute the following command.

```sh
npm install
```

-   To populate the database migration execute the following command.

```sh
npm run setup
```

-   To run the application execute the following command.

```sh
npm run dev
```

-   After that you will see the message:
    [Server running on http://localhost:3000]

## Run via docker

-   To build and run the application with Docker Compose, navigate to your project's directory in the terminal and run:

```sh
docker-compose up --build
```

-   To stop and remove the containers, run:

```sh
docker-compose down
```

# Data Model

-   This apllication primary has two table.
-   `rss_feed_sources` for store RSS Feed sources.
-   `articles` for store articles fetched from RSS Feeds.

## Table(rss_feed_sources)

### Structure

|       Column |     Type     |                     Description                      |
| -----------: | :----------: | :--------------------------------------------------: |
|         `id` |    SERIAL    |                 Auto-incrementing ID                 |
|     `vendor` | VARCHAR(255) |     Published by (Ex: BBC, CNN), required field      |
|        `url` | VARCHAR(500) |          URL of the vendor, required field           |
| `created_at` |  TIMESTAMP   | Record creation timestamp (default to current time)  |
| `updated_at` |  TIMESTAMP   |  Record update timestamp (default to current time)   |
| `deleted_at` |  TIMESTAMP   | Timestamp when the article was deleted (soft delete) |

### SCHEMA

```sh
CREATE TABLE IF NOT EXISTS rss_feed_sources (
    id SERIAL PRIMARY KEY,
    vendor VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
```

## Table(articles)

### Structure

|             Column |     Type     |                     Description                      |
| -----------------: | :----------: | :--------------------------------------------------: |
|               `id` |    SERIAL    |                 Auto-incrementing ID                 |
|            `title` | VARCHAR(255) |         Title of the article, required field         |
|      `description` | VARCHAR(500) |      Description of the article, required field      |
| `publication_date` | VARCHAR(500) |         Date when the article was published          |
|       `source_url` | VARCHAR(500) |      URL of the article source, required field       |
|           `topics` |    JSONB     |               Extracted article topics               |
|         `entities` |    JSONB     |              Extracted article entities              |
|       `created_at` |  TIMESTAMP   | Record creation timestamp (default to current time)  |
|       `updated_at` |  TIMESTAMP   |  Record update timestamp (default to current time)   |
|       `deleted_at` |  TIMESTAMP   | Timestamp when the article was deleted (soft delete) |

### SCHEMA

```sh
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    publication_date DATE NOT NULL,
    source_url VARCHAR(500) NOT NULL,
    topics JSONB,
    entities JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
```

# Topics And Named Enttites Extraction

-   To extract I define a m,ethod named `extractTopicsAndNamedEntities`. This method is designed to extract both topics and named entities from a given text using two different methods: topic modeling via Latent Dirichlet Allocation (LDA) and entity extraction using Natural Language Processing (NLP). Below is a breakdown of how the extraction works.

## Extract Named Entities (extractNamedEntities)

The extractNamedEntities function is responsible for identifying and extracting three types of named entities:

1. People: Any mention of people in the text.
2. Places: Geographical locations.
3. Organizations: Companies, institutions, etc.

```js
export const extractNamedEntities = (text) => {
	const doc = nlp(text);

	// Extract people
	const people = doc.people().out("array");

	// Extract places
	const places = doc.places().out("array");

	// Extract organizations
	const organizations = doc.organizations().out("array");

	return [...people, ...places, ...organizations];
};
```

-   The nlp(text) function is used to process the input text.
-   The method extracts people, places, and organizations as arrays using NLP functions like doc.people(), doc.places(), and doc.organizations().
-   The arrays of people, places, and organizations are combined into one using the spread operator (...) and returned as a single array of named entities.

## Extract Topics (extractTopics)

-   The extractTopics function applies Latent Dirichlet Allocation (LDA) to extract potential topics from the input text.

```js
export const extractTopics = (text) => {
	try {
		let topics = lda([text], 1, 5); // Apply LDA to extract 5 topics from the text
		topics = topics.length ? topics[0].map(({ term }) => term) : [];

		return topics;
	} catch (e) {
		return [];
	}
};
```

-   This method uses LDA to analyze the input text ([text]) and attempts to extract up to 5 topics.
-   lda([text], 1, 5) is applying LDA with:
    -   The input array of text [text].
    -   1 document for analysis (since it's only analyzing one text input).
    -   5 topics as the number of topics to extract.
-   The method maps the result and extracts only the terms from the topics.
-   If an error occurs during the process, it catches the exception and returns an empty array.

## Combine Both Named Entities and Topics (extractTopicsAndNamedEntities)

-   The main function `extractTopicsAndNamedEntities` combines both the named entities and topics extraction into a single result.

```js
export const extractTopicsAndNamedEntities = (text) => {
	try {
		const topics = extractTopics(text); // Extract topics from text
		const entities = extractNamedEntities(text); // Extract named entities from text

		return { topics, entities };
	} catch (e) {
		console.log(e); // Log any error
		return { topics: [], entites: [] }; // Return empty topics and entities in case of error
	}
};
```

## Use Case in the fetchArticles Method:

-   In the fetchArticles method provided earlier, this extractTopicsAndNamedEntities function is used for each article's content to extract the relevant information:

```js
const articles = await Promise.all(
	feed.items.map(async (item, i) => {
		// Extract topics and named entities
		const extraction = extractTopicsAndNamedEntities(
			item.contentSnippet || item.title
		);

		return [
			item.title,
			item.contentSnippet,
			formatDate(item.pubDate),
			item.link,
			JSON.stringify(extraction.topics),
			JSON.stringify(extraction.entities),
		];
	})
);
```

-   Input Text: It uses either the contentSnippet or title of the article as input for the extraction.
-   Topics and Entities: The extracted topics and entities are then saved as JSON strings and inserted into the database.

# API endpoints

These endpoints allow you to handle RSS FEED Sources & articles.

## GET

`get all RSS FEED sources` [/rss-feed-sources](#get-rss-feed-sources) <br/>
`get a single RSS FEED source` [/rss-feed-sources/:id](#get-single-rss-feed-source) <br/>
`get all articles` [/articles](#get-articles) <br/>
`get a single article` [/articles/:id](#get-single-article) <br/>
`filter article` [/articles?publication_date=2024-10-05&search=a-topics-name](#get-article-by-filtering) <br/>

## POST

`create a RSS FEED sources` [/rss-feed-sources](#post-a-rss-feed-sources) <br/>
`create a article` [/articles](#post-a-article) <br/>

## DELETE

`delete an article` [/articles/:id](#delete-an-article) <br/>
`delete an RSS FEED source` [/rss-feed-sources/:id](#delete-an-rss-feed-source) <br/>

---

### GET /rss-feed-sources

Get all RSS FEED sources.

**Response**

```js
{
    "status": "success",
    "code": 200,
    "message": "RSS Feed Sources retrieved successfully",
    "data": [
        {
            "id": 1,
            "vendor": "BBC",
            "url": "https://feeds.bbci.co.uk/news/rss.xml",
            "created_at": "2024-10-04T13:43:00.795Z",
            "updated_at": "2024-10-04T13:43:00.795Z",
            "deleted_at": null
        },
    ]
}
```

### GET /rss-feed-sources/:id

get a specific RSS FEED source by its id.

**Parameters**

|   ID | Required |  Type  | Description                |
| ---: | :------: | :----: | -------------------------- |
| `id` | required | number | id of the RSS FEED source. |

**Response**

```js
// If RSS FEED source exist
{
    "status": "success",
    "code": 200,
    "message": "RSS Feed Source retrieved successfully",
    "data": {
        "id": 1,
        "vendor": "Al-Jazeera",
        "url": "https://rss.app/feeds/pTCTwby5mGsOXpjh.xml",
        "created_at": "2024-10-05T01:38:50.445Z",
        "updated_at": "2024-10-05T01:38:50.445Z",
        "deleted_at": null
    }
}

// If article not found
{
    "status": "error",
    "code": 404,
    "message": "RSS Feed Source not found",
}
```

### POST /rss-feed-sources

create a new RSS FEED source

**Parameters**

|     Name | Required |  Type  | Description                                                          |
| -------: | :------: | :----: | -------------------------------------------------------------------- |
| `Vendor` | required | string | course description. Ex: `Al-Jazeera`                                 |
|    `url` | required | string | course description. Ex: `https://rss.app/feeds/pTCTwby5mGsOXpjh.xml` |

**Response**

```js
// if wrong data passed

{
    "status": "error",
    "code": 400,
    "message": "Invalid input",
}

// If successful
{
    "status": "success",
    "code": 200,
    "message": "RSS Feed Source successfully created",
    "data": {
        "id": 3,
        "vendor": "Al-Jazeera",
        "url": "https://rss.app/feeds/pTCTwby5mGsOXpjh.xml",
        "created_at": "2024-10-05T11:34:31.940Z",
        "updated_at": "2024-10-05T11:34:31.940Z",
        "deleted_at": null
    }
}
// or any error occured

{
    "status": "error",
    "code": 500,
    "message": "Internal server error",
}
```

### DELETE(SOFT DELETE) /rss-feed-sources/:id

Delete a specific RSS FEED source by its id.

**Parameters**

|   ID | Required |  Type  | Description                 |
| ---: | :------: | :----: | --------------------------- |
| `id` | required | number | id of the rss-feed-sources. |

**Response**

```js
// If article exist
{
    "status": "success",
    "code": 200,
    "message": "RSS Feed Source successfully deleted",
    "data": {
        "id": 1,
        "vendor": "Al-Jazeera",
        "url": "https://rss.app/feeds/pTCTwby5mGsOXpjh.xml",
        "created_at": "2024-10-05T01:38:50.445Z",
        "updated_at": "2024-10-05T01:38:50.445Z",
        "deleted_at": "2024-10-05T11:31:39.353Z"
    }
}
```

### GET /articles

Get all articles.

**Response**

```js
{
    "status": "success",
    "code": 200,
    "message": "Articles retrieved successfully",
    "data": [
        {
            "id": 1,
            "title": "What Russia wants from Israel-Iran escalation: Chaos good, war bad",
            "description": "Russia is dependent on Iran for military support in Ukraine, but has had complex ties with Hezbollah.",
            "publication_date": "2024-10-05",
            "source_url": "https://www.aljazeera.com/news/2024/10/5/what-russia-wants-from-israel-iran-escalation-chaos-good-war-bad",
            "topics": [
                "ukraine",
                "ties",
                "support",
                "russia",
                "military"
            ],
            "entities": [
                "Russia",
                "Iran",
                "Ukraine,"
            ],
            "created_at": "2024-10-05T10:14:02.049Z",
            "updated_at": "2024-10-05T10:14:02.049Z",
            "deleted_at": null
        }
    ]
}
```

### GET /articles/:id

get a specific article by its id.

**Parameters**

|   ID | Required |  Type  | Description        |
| ---: | :------: | :----: | ------------------ |
| `id` | required | number | id of the article. |

**Response**

```js
// If article exist
{
    "status": "success",
    "code": 200,
    "message": "Article retrieved successfully",
    "data": {
        "id": 380,
        "title": "What Russia wants from Israel-Iran escalation: Chaos good, war bad",
        "description": "Russia is dependent on Iran for military support in Ukraine, but has had complex ties with Hezbollah.",
        "publication_date": "2024-10-05",
        "source_url": "https://www.aljazeera.com/news/2024/10/5/what-russia-wants-from-israel-iran-escalation-chaos-good-war-bad",
        "topics": [
            "ukraine",
            "ties",
            "support",
            "russia",
            "military"
        ],
        "entities": [
            "Russia",
            "Iran",
            "Ukraine,"
        ],
        "created_at": "2024-10-05T10:15:01.736Z",
        "updated_at": "2024-10-05T10:15:01.736Z",
        "deleted_at": null
    }
}

// If article not found
{
    "status": "error",
    "code": 404,
    "message": "Article not found"
}
```

### GET /articles/?publication_date=2024-10-05&search=a-topics-name

filter articles by publication_date, topics or price.

**Parameters**

|               Name | Required |  Type  | Description                                |
| -----------------: | :------: | :----: | ------------------------------------------ |
| `publication_date` | optional | string | article publication date. Ex: `2024-10-05` |
|           `search` | optional | string | search with a topics. Ex:. `cricket`       |

**Response**

```js
// If articles exist
{
    "status": "success",
    "code": 200,
    "message": "Articles retrieved successfully",
    "data": [
        {
            "id": 1,
            "title": "What Russia wants from Israel-Iran escalation: Chaos good, war bad",
            "description": "Russia is dependent on Iran for military support in Ukraine, but has had complex ties with Hezbollah.",
            "publication_date": "2024-10-05",
            "source_url": "https://www.aljazeera.com/news/2024/10/5/what-russia-wants-from-israel-iran-escalation-chaos-good-war-bad",
            "topics": [
                "ukraine",
                "ties",
                "support",
                "russia",
                "military"
            ],
            "entities": [
                "Russia",
                "Iran",
                "Ukraine,"
            ],
            "created_at": "2024-10-05T10:14:02.049Z",
            "updated_at": "2024-10-05T10:14:02.049Z",
            "deleted_at": null
        }
    ]
}

// If no articles found

{
    "status": "success",
    "code": 200,
    "message": "Articles retrieved successfully",
    "data": []
}
```

### POST /articles

create a new course

**Parameters**

|               Name | Required |  Type  | Description                                                                                                              |
| -----------------: | :------: | :----: | ------------------------------------------------------------------------------------------------------------------------ |
|            `title` | required | string | course description. Ex: `Popular news of the day`                                                                        |
|      `description` | optional | string | course description. Ex: `Description of the news`                                                                        |
| `publication_date` | required | string | course instructor name. Ex: `2024-10-05`                                                                                 |
|       `source_url` | required | string | course duration. Ex:. `https://www.aljazeera.com/news/2024/10/5/what-is-the-electoral-college-what-to-know-in-500-words` |
|           `topics` | optional | array  | price of the course. Ex: `["electoral"]`                                                                                 |
|         `entities` | optional | array  | price of the course. Ex: `["college"]`                                                                                   |

**Response**

```js
// if wrong data passed

{
    "status": "error",
    "code": 400,
    "message": "Invalid input",
}

// If successful
{
    "status": "success",
    "code": 200,
    "message": "Article successfully created",
    "data": {
        "id": 1,
        "title": "What Russia wants from Israel-Iran escalation: Chaos good, war bad",
        "description": "Russia is dependent on Iran for military support in Ukraine, but has had complex ties with Hezbollah.",
        "publication_date": "2024-10-05",
        "source_url": "https://www.aljazeera.com/news/2024/10/5/what-russia-wants-from-israel-iran-escalation-chaos-good-war-bad",
        "topics": [
            "ukraine",
            "ties",
            "support",
            "russia",
            "military"
        ],
        "entities": [
            "Russia",
            "Iran",
            "Ukraine,"
        ],
        "created_at": "2024-10-05T10:14:02.049Z",
        "updated_at": "2024-10-05T10:14:02.049Z",
        "deleted_at": null
    }
}

// or any error occured

{
    "status": "error",
    "code": 500,
    "message": "Internal server error",
}
```

### DELETE(SOFT DELETE) /articles/:id

delete a specific article by its id.

**Parameters**

|   ID | Required |  Type  | Description        |
| ---: | :------: | :----: | ------------------ |
| `id` | required | number | id of the article. |

**Response**

```js
// If article exist
{
    "status": "success",
    "code": 200,
    "message": "Article successfully deleted",
    "data": {
        "id": 380,
        "title": "What Russia wants from Israel-Iran escalation: Chaos good, war bad",
        "description": "Russia is dependent on Iran for military support in Ukraine, but has had complex ties with Hezbollah.",
        "publication_date": "2024-10-05",
        "source_url": "https://www.aljazeera.com/news/2024/10/5/what-russia-wants-from-israel-iran-escalation-chaos-good-war-bad",
        "topics": [
            "ukraine",
            "ties",
            "support",
            "russia",
            "military"
        ],
        "entities": [
            "Russia",
            "Iran",
            "Ukraine,"
        ],
        "created_at": "2024-10-05T10:15:01.736Z",
        "updated_at": "2024-10-05T10:15:01.736Z",
        "deleted_at": "2024-10-05T11:19:36.000Z"
    }
}
```

## Scheduler to fetch Articles periodically from RSS Feed Sources.

-   To fetch articles periodically I use scheduler.
-   For this application I use `node-cron` library.
-   Default value added in `.env` file. Key name is `DEFAULT_ARTICLE_FETCH_SCHEDULE`.
-   For persist the value, it is stored in `config` folder. File name is `scheduler.json`.

### Update scheduler config.

-   By default scheduler run in everyday at midnight.
-   You can change the scheduler time.
-   Open `scheduler.json` file from `config` folder.
-   Update with following format.

```js
{
    "article": {
        "minute": 0, // The minute field. Cuurent value: (0 minutes past the hour)
        "hour": 0, // The hour field. Cuurent value: (midnight)
        "dayOfTheMonth": "*", // The day of the month. Cuurent value: (every day of the month)
        "month": "*", // The month. Cuurent value: (everymonth)
        "dayOfTheWeek": "*" // The day of the week. Cuurent value: (everyday)
    }
}
```
