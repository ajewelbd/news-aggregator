import cron from "node-cron";
import dotenv from "dotenv";
import { readJsonFileSync } from "../../utils/common.js";
import { fetchArticles } from "./ArticleFetchController.js";

dotenv.config();

export const initiateArticleFetchScheduler = () => {
	const schedulerConfig = readJsonFileSync("./src/config/scheduler.json");
	let articleConfig = schedulerConfig?.article;

	if (!articleConfig) {
		const fallBackSchedule = {
			minute: 0,
			hour: 0,
			dayOfTheMonth: "*",
			month: "*",
			dayOfTheWeek: "*",
		};

		articleConfig =
			process.env.DEFAULT_ARTICLE_FETCH_SCHEDULE || fallBackSchedule;
	}
	const schedule = `${articleConfig.minute} ${articleConfig.hour} ${articleConfig.dayOfTheMonth} ${articleConfig.month} ${articleConfig.dayOfTheWeek}`;

	console.log(schedule);

	// Schedule the task to run every hour
	cron.schedule(schedule, async () => {
		try {
			await fetchArticles(); // Call your fetchArticles method
			console.log("Articles fetched successfully.");
		} catch (error) {
			console.error("Error fetching articles:", error);
		}
	});
};
