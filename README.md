# NDBI: A database abstraction layer for Node.js

NDBI is a database abstraction layer (DAL) for Node.js. It is modeled after
Perl's `DBI` module and PHP's `PDO` module. It is written with ES8 async/await
in mind, while providing a common set of function interfaces for all supported
database types, and it is easy to implement new drivers as needed.

# Usage Examples

Basic Usage:

```javascript
    const Ndbi = require("ndbi");
    async function main() {
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

Transactions:

```javascript
    const Ndbi = require("ndbi");
    
    async function main() {
        const ndbi = new Ndbi("postgres:host=localhost;database=test");
        
        await ndbi.connect();
        await ndbi.transaction(async function () {
            await ndbi.execute("CREATE TABLE foo(name TEXT)");
            await ndbi.execute("INSERT INTO foo SELECT bar FROM baz");
            await ndbi.execute("DROP TABLE baz");
        });
    }
```

# Drivers

Drivers are manage by the `Ndbi.DriverManager` class. An instance of this class
is created at startup and available at `Ndbi.driverManager`. This class holds
a registry of dsn string prefixes that map to node module names. The following
drivers are currently available:

|DSN prefix|Node Module|Description|
|---|---|---|
|postgres:|ndbi-driver-postgres|NDBI driver that wraps `node-postgres`|

Other drivers can easily be implemented by using `ndbi-driver-postgres` as a
template. Drivers need to implement constructor and a set of methods that
conform to the specifications below.

|Method Name|Required?|Signature|Description|
|---|---|---|---|
|`[[constructor]]`|Y|`new Driver(dsn: string, username:string|null, password:string|null, options:Object)`|Constructor|
|`beginTransaction`|N|`driver.beginTransaction(): Promise<undefined>`|Puts driver into transaction mode. If this method is omitted it is polyfilled with `execute`.|
|`commit`|N|`driver.commit(): Promise<undefined>`|Commits the current transaction. If method is omitted it is polyfilled with `execute`.|
|`connect`|Y|`driver.connect(): Promise<undefined>`|Connects to the database and updates driver instance state.|
|`disconnect`|Y|`driver.disconnect(): Promise<undefined>`|Disconnects from the database and updates driver instance state, reconnection should be allowed.|
|`execute`|N|`driver.execute(sql: string, params: Array, options: {}): Promise<Statement>`| Executes the sql and parameters and returns an object conforming to the Statement interface that is already resolved. If this method is omitted from the driver, then it is polyfilled using `query`.|
|`lastInsertId`|Y|`driver.lastInsertId(catalog: string|null, schema: string|null, table: string|null, field: string|null): Promise<number>`|Retrieves the last insert ID. Driver-dependant, may not be supported by all databases. Reject promise with error if not supported.|
|`prepare`|Y|`driver.prepare(sql: string, options:Object): Promise<Statement>`|Prepares the statement and returns an object that conforms to the Statement interface.|
|`query`|N|`driver.query(sql: string, params: Array, options: {}): Promise<Statement>`| Executes the sql and parameters and returns an object conforming to the Statement interface that is already resolved. If this method is omitted from the driver, then it polyfilled using `prepare`.|
|`rollback`|N|`driver.rollback(): Promise<undefined>`|Rollsback the current transaction. If method is omitted it is polyfilled via `execute`.|
|`transaction`|N|`driver.transaction(promisor: (function(): Promise)): Promise`|Accepts a callback. The callback should return a promise. Begin a transaction, run the callback, wait for it to resolve, and either commit or rollback depending the result of `promisor`. If this is omitted it is polyfilled via `beginTransaction` and `commit`/`rollback`|

Statements model prepared connections, and the results of an execution. A statement should be `execute`d and then read from. Below is the interface requirements for a Statement:

|Method Name|Signature|Description|
|---|---|---|
|`execute`|`stmt.execute(params: Array?): Promise<undefined>`|Tell DB server to execute prepared statement with optional arguments|
|`fetchRow`|`stmt.fetchRow(): Promise<row?>`|Pull the next row from an executed statement. Returns undefined when no rows available|
|`fetchAll`|`stmt.fetchAll(): Promise<rows>`|Fulfill promise with all rows received from server|

