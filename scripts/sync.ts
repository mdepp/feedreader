import database from "~/services/database.server";

async function main() {
  while (true) {
    console.log("Syncing feeds");
    await database.sync();
    console.log("Finished sync, waiting an hour");
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 60));
  }
}

main().catch((error) => {
  console.error(error);
});
