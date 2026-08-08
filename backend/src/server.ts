import { app } from "@/app";
import { env } from "@/config/env";

app.listen(env.PORT, () => {
  console.log(
    `Yu-Gi-Oh Store API running on http://localhost:${env.PORT}`
  );
});