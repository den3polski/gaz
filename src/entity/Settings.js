var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Setting", 
    tableName: "settings", 
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
