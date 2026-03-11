import app from "./index";
import { GCPPubSubSubscription } from "./services/gcp/gcp-pubsub-subscription.service";

const PORT = 3000;
const gcpPubSubSubscription = new GCPPubSubSubscription();

gcpPubSubSubscription.startListening();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
