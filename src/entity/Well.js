var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({

    name: "Well", 
    
    tableName: "wells", 
    
    columns: {
        
        id: {
            primary: true,
            type: "int",
            generated: true
        },

        title: {
            type: "varchar"
        },

        text: {
            type: "text"
        },

        depthProject: {
            type: "double",
            nullable: true
        },

        temperatureProject:{
            type: "varchar",
            nullable: true
        },

        sms: {
            type: "varchar",
            nullable: true
        },

        useGroundPrinciple: {
            type: "varchar",
            nullable: true
        }
    },
    
    relations: {
        
        cluster: {
            target: "Cluster",
            type: "many-to-one",
            joinTable: true,
            cascade: true,
            eager: true
        },

        measurements: {
            target: "Measurement",
            type: "one-to-many",
            joinTable: true,
            cascade: true
        }
    }
});
