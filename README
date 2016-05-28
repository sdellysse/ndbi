# NDBI: A database abstraction layer for Node.js

NDBI is a database abstraction layer (DAL) for Node.js. It is modeled after
Perl's `DBI` module and PHP's `PDO` module. It is written with ES8 async/await
in mind, while providing a common set of function interfaces for all supported
database types, and it is easy to implement new drivers as needed.

Examples:

```javascript
    async function main() {
        const Ndbi = require("ndbi");

        const ndbi = new Ndbi("postgres:host=localhost;database=test");
        await ndbi.connect();

        const stmt = await ndbi.prepare("SELECT * FROM foo WHERE bar = $1");
        await stmt.execute([ "baz" ]);

        let row;
        while (row = await stmt.fetchRow()) {
            console.log(`row.spam = ${ row.spam }`);
        }

        await ndbi.disconnect();
    }
```
