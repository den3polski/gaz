const {createConnection} = require("typeorm")

createConnection({
    type: "sqlite",   
    database: "database.sqlite",
    synchronize: true,
    entities: [
          require("./entity/Cluster"),
          require("./entity/Bill"),
          require("./entity/Well"),
          require("./entity/Measurement"),
          require("./entity/Settings"),
          require("./entity/Report"),
      ]
 })