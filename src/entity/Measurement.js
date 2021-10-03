var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({

    name: "Measurement", 
    tableName: "measurements", 
    
    columns: {

        id: {
            primary: true,
            type: "int",
            generated: true
        },
        
        date: {
            type: "varchar"
        },
        
        depth: {
            type: "double"
        },
       
        heightTotal: {
            type: "double",
            nullable: true,
        },

        heightAboveGround: {
            type: "double",
            nullable: true,
        },

        values: {
            type: "text"
        },
        
        comment: {
            type: "text",
            nullable: true,
        }
    },
    
    relations: {
        
        well: {
            target: "Well",
            type: "many-to-one",
            joinTable: true,
            cascade: true,
            eager: true
        },

        bill: {
            target: "Bill",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        },

 
    }
});
