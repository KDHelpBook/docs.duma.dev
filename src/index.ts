import {
  createRegistry,
  type RegistryConfig,
} from "@kdhelpbook/cf-registry";
import config from "../.khb-registry/config.json";

// `npm run build` validates this generated JSON against the package schema.
export default createRegistry(config as RegistryConfig);
