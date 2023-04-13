import database from "~/services/database.server";

async function main() {
  while (true) {
    await database.sync();
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60));
  }
}

main().catch((error) => {
  console.error(error);
});
