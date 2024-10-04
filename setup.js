// This file is for install application dependency such as database migration, cron job and so on.

import { migration } from "./src/database/migration.js";

const init = async () => {
	try {
		await migration();
		process.exit();
	} catch (error) {
		console.log(`Somwthing went wrong!. Error:: ${error}`);
	}
};

init();
