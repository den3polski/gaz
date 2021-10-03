var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Report", 
    tableName: "reports", 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        value: {
            type: "text"
        }
    },    
});
