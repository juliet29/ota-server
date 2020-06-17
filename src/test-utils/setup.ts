import { testConn } from "./testConn";

// ensure that the database connection closes after tests are run
testConn(true).then(() => process.exit());
