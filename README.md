# News Dating

## Proxy

You need to run a proxy server to be able to fetch the rss content from it's source. You can use the [AllOrigins](https://github.com/gnuns/allorigins) one (it's open-source).

You can update the proxy's url in `$lib/constants.js` file under the `PROXY_URL` property.

## Database

You need a database to store user's and their data. Run the following script to create the database and it's tables.

```sql
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `rss-news`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookmarks`
--
CREATE TABLE `bookmarks` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `url` varchar(500) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` varchar(500) NOT NULL,
  `img` varchar(1000) NOT NULL,
  `color` char(6) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--
CREATE TABLE `categories` (
  `id` int NOT NULL,
  `label` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `lang` char(2) NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--
INSERT INTO `categories` (`id`, `label`, `url`, `lang`, `isDefault`) VALUES
(1, 'France', 'https://www.france24.com/fr/france/rss', 'FR', 1),
(2, 'World', 'https://www.france24.com/fr/rss', 'FR', 1),
(3, 'Business/Tech', 'https://www.france24.com/en/business/rss', 'EN', 1),
(4, 'Sports', 'https://www.france24.com/fr/sports/rss', 'FR', 1),
(5, 'Culture', 'https://www.france24.com/fr/culture/rss', 'FR', 0),
(6, 'Earth', 'https://www.france24.com/fr/earth/rss', 'FR', 0),
(7, 'Health', 'https://www.france24.com/fr/health/rss', 'FR', 0);

-- --------------------------------------------------------

--
-- Table structure for table `userCategories`
--
CREATE TABLE `userCategories` (
  `userId` int NOT NULL,
  `categoryId` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `passwordHash` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Indexes for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_userId` (`userId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userCategories`
--
ALTER TABLE `userCategories`
  ADD PRIMARY KEY (`userId`,`categoryId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);


--
-- AUTO_INCREMENT for table `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


--
-- Constraints for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `userCategories`
--
ALTER TABLE `userCategories`
  ADD CONSTRAINT `userCategories_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `userCategories_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;
```

## Running

Just run `pnpm run dev` to serve the website.

## TODO

- [x] Add sign-up
- [x] Add log-out
- [x] Add account deletion
- [ ] Add home page
- [ ] Add internationalisation
