var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Bill", 
    tableName: "bills", 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        date: {
            type: "varchar"
        },
        comment: {
            type: "text"
        },
        heightConductor: {
            type: "double",
            nullable: true
        },

        heightTape: {
            type: "double",
            nullable: true
        },

        temperature: {
            type: "double",
            nullable: true
        }

    },
    
    relations: {

        measurements: {
            target: "Measurement",
            type: "one-to-many",
            joinTable: true,
            cascade: true
        },

        cluster: {
            target: "Cluster",
            type: "many-to-one",
            joinTable: true,
            cascade: true,
            eager: true
        },

    }
});
