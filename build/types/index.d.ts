import { Dialect } from "./dialect";
import AtlasHcl from "./atlashcl";
export declare function AutoRegisterToMonaco(dialect: Dialect): {
    atlashcl: AtlasHcl;
    registerCompletionItemProvider: (dialect: Dialect) => void;
};
export default AtlasHcl;
