var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Cluster", 
    tableName: "clusters", 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        number: {
            type: "varchar"
        },
    },
    
    relations: {
        
        wells: {
            target: "Well",
            type: "one-to-many",
            joinTable: true,
            cascade: true
        },

        bills: {
            target: "Bill",
            type: "one-to-many",
            joinTable: true,
            cascade: true
        }
    }
});
