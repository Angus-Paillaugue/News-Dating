# News Dating

## Proxy

You need to run a proxy server to be able to fetch the rss content from it's source. You can use the [AllOrigins](https://github.com/gnuns/allorigins) one (it's open-source).

You can update the proxy's url in `$lib/constants.js` file under the `PROXY_URL` property.

## Database

You need a database to store user's and their data. Run the following script to create the database and it's tables.

```sql
-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 07, 2024 at 08:46 PM
-- Server version: 8.0.39-0ubuntu0.24.04.2
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `news-dating`
--
CREATE DATABASE IF NOT EXISTS `news-dating` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `news-dating`;

-- --------------------------------------------------------

--
-- Table structure for table `bookmarks`
--

CREATE TABLE IF NOT EXISTS `bookmarks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `url` varchar(500) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` varchar(500) NOT NULL,
  `img` varchar(1000) NOT NULL,
  `color` char(6) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_userId` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL,
  `lang` char(2) NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `providerId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `label`, `url`, `lang`, `isDefault`, `providerId`) VALUES
(1, 'France', 'https://www.france24.com/fr/france/rss', 'FR', 1, 1),
(2, 'World', 'https://www.france24.com/fr/rss', 'FR', 1, 1),
(3, 'Business/Tech', 'https://www.france24.com/en/business/rss', 'EN', 0, 1),
(4, 'Sports', 'https://www.france24.com/fr/sports/rss', 'FR', 1, 1),
(5, 'Culture', 'https://www.france24.com/fr/culture/rss', 'FR', 0, 1),
(6, 'Earth', 'https://www.france24.com/fr/planete/rss', 'FR', 0, 1),
(8, 'Toute l\'actu', 'https://www.bfmtv.com/rss/news-24-7/', 'FR', 1, 2),
(9, 'Santé', 'https://www.bfmtv.com/rss/sante/', 'FR', 0, 2),
(10, 'Auto', 'https://www.bfmtv.com/rss/auto/', 'FR', 0, 2),
(11, 'Culture', 'https://www.bfmtv.com/rss/culture/', 'FR', 0, 2),
(12, 'International', 'https://www.bfmtv.com/rss/international/', 'FR', 0, 2),
(13, 'Politique', 'https://www.bfmtv.com/rss/politique/', 'FR', 1, 2),
(14, 'Sciences', 'https://www.bfmtv.com/rss/sciences/', 'FR', 0, 2),
(15, 'Environnement', 'https://www.bfmtv.com/rss/environnement/', 'FR', 0, 2),
(16, 'Climat', 'https://www.bfmtv.com/rss/environnement/climat/', 'FR', 0, 2),
(17, 'Police-Justice', 'https://www.bfmtv.com/rss/police-justice/', 'FR', 0, 2),
(18, 'Société', 'https://www.bfmtv.com/rss/societe/', 'FR', 0, 2),
(19, 'Voyage', 'https://www.bfmtv.com/rss/voyage/', 'FR', 0, 2),
(20, 'Annimaux', 'https://www.bfmtv.com/rss/animaux/', 'FR', 0, 2),
(21, 'Cuisine', 'https://www.bfmtv.com/rss/cuisine/', 'FR', 0, 2),
(22, 'People', 'https://www.bfmtv.com/rss/people/', 'FR', 0, 2),
(23, 'Mode', 'https://www.bfmtv.com/rss/people/mode/', 'FR', 0, 2),
(24, 'Cinéma', 'https://www.bfmtv.com/rss/people/cinema/', 'FR', 0, 2),
(25, 'Musique', 'https://www.bfmtv.com/rss/people/musique/', 'FR', 0, 2),
(26, 'Série', 'https://www.bfmtv.com/rss/people/series/', 'FR', 0, 2),
(27, 'Tech', 'https://www.bfmtv.com/rss/tech/', 'FR', 1, 2),
(28, 'Tech - Nouveautes produits', 'https://www.bfmtv.com/rss/tech/nouveautes-produits/', 'FR', 0, 2),
(29, 'Culture web', 'https://www.bfmtv.com/rss/tech/culture-web/', 'FR', 0, 2),
(30, 'Vie numérique', 'https://www.bfmtv.com/rss/tech/vie-numerique/', 'FR', 0, 2),
(31, 'Crypto', 'https://www.bfmtv.com/rss/crypto/', 'FR', 0, 2),
(32, 'Bourse', 'https://www.tradingsat.com/rssbourse.xml', 'FR', 1, 2),
(33, 'Immobilier', 'https://www.bfmtv.com/rss/immobilier/', 'FR', 0, 2),
(34, 'Economie & Social', 'https://www.bfmtv.com/rss/economie/economie-social/', 'FR', 0, 2),
(35, 'Finances publiques', 'https://www.bfmtv.com/rss/economie/economie-social/finances-publiques/', 'FR', 0, 2),
(36, 'A la une', 'https://www.lemonde.fr/rss/une.xml', 'FR', 0, 3),
(37, 'La une International', 'https://www.lemonde.fr/international/rss_full.xml', 'FR', 0, 3),
(38, 'Europe', 'https://www.lemonde.fr/europe/rss_full.xml', 'FR', 0, 3),
(39, 'Amériques', 'https://www.lemonde.fr/ameriques/rss_full.xml', 'FR', 0, 3),
(40, 'Afrique', 'https://www.lemonde.fr/afrique/rss_full.xml', 'FR', 0, 3),
(41, 'Asie pacifique', 'https://www.lemonde.fr/asie-pacifique/rss_full.xml', 'FR', 0, 3),
(42, 'Proche orient', 'https://www.lemonde.fr/proche-orient/rss_full.xml', 'FR', 0, 3),
(43, 'Royaume uni', 'https://www.lemonde.fr/royaume-uni/rss_full.xml', 'FR', 0, 3),
(44, 'Etats unis', 'https://www.lemonde.fr/etats-unis/rss_full.xml', 'FR', 0, 3);

-- --------------------------------------------------------

--
-- Table structure for table `providers`
--

CREATE TABLE IF NOT EXISTS `providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `previewTitleSelector` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `previewUrlSelector` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `previewDescriptionSelector` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `previewDateSelector` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `previewImgSelector` varchar(100) NOT NULL,
  `articleContentContainerSelector` varchar(100) NOT NULL,
  `articleContentExcludeSelector` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `providers`
--

INSERT INTO `providers` (`id`, `name`, `previewTitleSelector`, `previewUrlSelector`, `previewDescriptionSelector`, `previewDateSelector`, `previewImgSelector`, `articleContentContainerSelector`, `articleContentExcludeSelector`) VALUES
(1, 'france24', 'title', 'link', 'description', 'pubDate', 'source', '.t-content__body', '.o-self-promo'),
(2, 'BFM TV', 'title', 'link', 'description', 'pubDate', 'enclosure', '.content_body', ''),
(3, 'Le Monde', 'title', 'link', 'description', 'pubDate', 'media:content', 'article.article__content, #post-container', '.article__media || .article__reactions || .paywall');

-- --------------------------------------------------------

--
-- Table structure for table `userCategories`
--

CREATE TABLE IF NOT EXISTS `userCategories` (
  `userId` int NOT NULL,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`userId`,`categoryId`),
  KEY `categoryId` (`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `passwordHash` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Constraints for dumped tables
--

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
- [x] Add horizontal scroll components that works on mouse drag
- [ ] Add more providers and categories
- [ ] Add an interactive modal to add a custom RSS source using regex and highlighting in color matching parts
